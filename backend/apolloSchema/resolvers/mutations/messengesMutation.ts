import errorHandler from "../../../lib/errorHandler";
import { IApolloContext } from "../../../types/IApolloContext";
import Messenge from "../../../models/Messenge";
import pubsub, {MessengesEvents} from "../../PubSub";
import ApiError from "../../../lib/ApiError";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";
import { FileUpload } from "graphql-upload";
import saveFilesFromStream from "../../../lib/saveFilesFromStream";
import AccordFile from "../../../models/AccordFile";


interface IInputMessenge{
    messenge?: string;
    imgs?: Promise<FileUpload>[] | null;
    videos?: Promise<FileUpload>[] | null;
    audios?: Promise<FileUpload>[] | null;
    documents?: Promise<FileUpload>[] | null;
}
interface IInputSendMessenge extends IInputMessenge{
    recipientId: number;
}
interface IInputEditMessenge extends IInputMessenge{
    messengeId: number;
}

export default {
    async sendMessenge(_: any, {recipientId, messenge, imgs, videos, audios, documents}: IInputSendMessenge, {resp}: IApolloContext){
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
                console.log(err);
            }
            
            const messengeObj = await Messenge.create({
                recipientId: recipientId,
                authorId: resp.locals.user.id,
                text: !messenge ? '' : messenge,
                imgs: imgsPath,
                videos: videosPath,
                audios: audiosPath
            });

            if(documents?.length && documentsPath.length){
                let index = 0;
                for await (const document of documents) {
                    await messengeObj.createAccordFile({
                        filename: document.filename,
                        codedFilename: documentsPath[index++]
                    });
                }
            }

            pubsub.publish(MessengesEvents.messengeSend, {
                messengeId: messengeObj.id,
                recipientId: messengeObj.recipientId
            });
            
            return true;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async removeMessenge(_: any, {messengeId, clientInvisibility}: {messengeId: number, clientInvisibility: boolean}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const messenge = await Messenge.findByPk(messengeId);
            if(!messenge)
                return false;

            if(clientInvisibility)
                await messenge.update({
                    clientInvisibility
                });
            else
                await messenge.destroy();

            pubsub.publish(MessengesEvents.messengeRemove, {
                messengeId: messenge.id,
                recipientId: messenge.recipientId
            });

            return true;
        } 
        catch(err: any){
            errorHandler(err);
        }
    },

    async editMessenge(_: any, {messengeId, messenge: messengeText, imgs, videos, audios, documents}: IInputEditMessenge, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const messenge = await Messenge.findByPk(messengeId);
            if(!messenge) throw ApiError.badRequest('Сообщение не найдено');

            let imgsPath: string[] = messenge.imgs;
            let videosPath: string[] = messenge.videos;
            let audiosPath: string[] = messenge.audios;
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
                console.log(err);
            }

            messenge.update({
                text: !messengeText ? messenge.text : messengeText,
                imgs: imgsPath,
                videos: videosPath,
                audios: audiosPath
            });

            const newFiles: AccordFile[] = [];
            if(documents?.length && documentsPath.length){
                let index = 0;
                for await (const document of documents) {
                    const newFile = await AccordFile.create({
                        filename: document.filename,
                        codedFilename: documentsPath[index++]
                    });
                    newFiles.push(newFile);
                }
            }
            const oldFiles = (await messenge.getAccordFiles()).map(accordFile => accordFile);
            await messenge.setAccordFiles([...newFiles, ...oldFiles]);

            pubsub.publish(MessengesEvents.messengeEdit, {
                messengeId: messenge.id,
                recipientId: messenge.recipientId
            });

            return true;
        } 
        catch(err: any){
            errorHandler(err);
        }
    }
};