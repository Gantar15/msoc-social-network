import errorHandler from "../../../lib/errorHandler";
import { IApolloContext } from "../../../types/IApolloContext";
import Messenge from "../../../models/Messenge";
import pubsub, {MessengesEvents} from "../../PubSub";
import ApiError from "../../../lib/ApiError";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";
import { FileUpload } from "graphql-upload";
import saveFilesFromStream from "../../../lib/saveFilesFromStream";


interface InputCreateMessenge{
    recipientId: number;
    messenge: string;
    imgs: Promise<FileUpload>[] | null;
    videos: Promise<FileUpload>[] | null;
    audios: Promise<FileUpload>[] | null;
    documents: Promise<FileUpload>[] | null;
}

export default {
    async sendMessenge(_: any, {recipientId, messenge, imgs, videos, audios, documents}: InputCreateMessenge, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const recipientCandidate = await User.findByPk(recipientId);
            if(!recipientCandidate) throw ApiError.badRequest('Получатель не найден');

            let imgsPath: string[] = [];
            let videosPath: string[] = [];
            let audiosPath: string[] = [];
            let documentsPath: string[] = [];
            try{
                if(imgs){
                    imgsPath = await saveFilesFromStream(imgs, 'messenges_imgs');
                }
                if(videos){
                    videosPath = await saveFilesFromStream(videos, 'messenges_videos');
                }
                if(audios){
                    audiosPath = await saveFilesFromStream(audios, 'messenges_audios');
                }
                if(documents){
                    documentsPath = await saveFilesFromStream(documents, 'messenges_documents');
                }
            } catch(err){
                console.log(err)
            }
            
            const messengeObj = await Messenge.create({
                recipientId: recipientId,
                authorId: resp.locals.user.id,
                text: messenge,
                imgs: imgsPath,
                videos: videosPath,
                audios: audiosPath
            });

            if(documents){
                let index = 0;
                for await (const document of documents) {
                    messengeObj.createAccordFile({
                        filename: document.filename.split('\\')[document.filename.split('\\').length-1],
                        codedFilename: documentsPath[index]
                    });
                    ++index;
                }
            }

            pubsub.publish(MessengesEvents.messengeSend, {
                messenge: messengeObj
            });
            
            return messengeObj;
        } catch(err: any){
            errorHandler(err);
        }
    }
};