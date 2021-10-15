import errorHandler from "../../../lib/errorHandler";
import { IApolloContext } from "../../../types/IApolloContext";
import Messenge from "../../../models/Messenge";
import pubsub, {PubSubEvents} from "../../PubSub";
import ApiError from "../../../lib/ApiError";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";
import { FileUpload } from "graphql-upload";
import {join, parse} from 'path';
import fs from 'fs';
import {Readable} from 'stream';
import {v4 as uuidv4} from 'uuid';


interface InputCreateMessenge{
    recipientId: number;
    messenge: string;
    imgs: Promise<FileUpload>[] | null;
    videos: Promise<FileUpload>[] | null;
    audios: Promise<FileUpload>[] | null;
}

export default {
    async sendMessenge(_: any, {recipientId, messenge, imgs, videos, audios}: InputCreateMessenge, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const recipientCandidate = await User.findByPk(recipientId);
            if(!recipientCandidate) throw ApiError.badRequest('Получатель не найден');

            let imgsPath: string[] = [];
            let videosPath: string[] = [];
            let audiosPath: string[] = [];
            try{
                if(imgs){
                    imgsPath = await Promise.all(imgs.map(async (image) => {
                        const imageUploadObj = await image;
                        const imgStream: Readable = imageUploadObj.createReadStream();
                        const fileExt = parse(imageUploadObj.filename).ext;
                        const filename = uuidv4() + fileExt;
                        const imgPath = join(__dirname, '..', '..', '..', 'files', 'messenges_imgs', filename);
                        imgStream.pipe(fs.createWriteStream(imgPath));
                        return `${process.env.SITE_URL}/posts_imgs/${filename}`;
                    }));
                }
                if(videos){
                    videosPath = await Promise.all(videos.map(async (video) => {
                        const videoUploadObj = await video;
                        const videoStream: Readable = videoUploadObj.createReadStream();
                        const fileExt = parse(videoUploadObj.filename).ext;
                        const filename = uuidv4() + fileExt;
                        const videoPath = join(__dirname, '..', '..', '..', 'files', 'messenges_videos', filename);
                        videoStream.pipe(fs.createWriteStream(videoPath));
                        return `${process.env.SITE_URL}/posts_videos/${filename}`;
                    }));
                }
                if(audios){
                    audiosPath = await Promise.all(audios.map(async (audio) => {
                        const audioUploadObj = await audio;
                        const audioStream: Readable = audioUploadObj.createReadStream();
                        const fileExt = parse(audioUploadObj.filename).ext;
                        const filename = uuidv4() + fileExt;
                        const audioPath = join(__dirname, '..', '..', '..', 'files', 'messenges_audios', filename);
                        audioStream.pipe(fs.createWriteStream(audioPath));
                        return `${process.env.SITE_URL}/posts_videos/${filename}`;
                    }));
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
            pubsub.publish(PubSubEvents.messengeSend, {
                messenge: messengeObj
            });
            
            return messengeObj;
        } catch(err: any){
            errorHandler(err);
        }
    }
};