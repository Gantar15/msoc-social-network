import errorHandler from '../../../lib/errorHandler';
import ApiError from '../../../lib/ApiError';
import Post from '../../../models/Post';
import type {IApolloContext} from '../../../types/IApolloContext';
import { checkAuth } from '../../../middlewares/auth-middleware';
import type {FileUpload} from 'graphql-upload';
import {join} from 'path';
import fs from 'fs';
import {Readable} from 'stream';
import {v4 as uuidv4} from 'uuid';
import fileType from 'file-type';


interface InputPost{
    desc: string;
    imgs: string[];
}

export default {
    async createPost(_:any, {desc, imgs, videos}: {desc: string | null, imgs: Promise<FileUpload>[] | null, videos: Promise<FileUpload>[] | null}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            let imgsPath: string[] = [];
            let videosPath: string[] = [];
            try{
                if(imgs){
                    imgsPath = await Promise.all(imgs.map(async (image) => {
                        const imageUploadObj = await image;
                        const imgStream: Readable = imageUploadObj.createReadStream();
                        const fileExt = (await fileType.fromStream(imgStream))!.ext;
                        const filename = uuidv4();
                        const imgPath = join(__dirname, '..', '..', '..', 'files', 'posts_imgs', filename);
                        await imgStream.pipe(fs.createWriteStream(imgPath));
                        return imgPath;
                    }));
                }
                if(videos){
                    videosPath = await Promise.all(videos.map(async (video) => {
                        const videoUploadObj = await video;
                        const videoStream: Readable = videoUploadObj.createReadStream();
                        const fileExt = (await fileType.fromStream(videoStream))!.ext;
                        const filename = uuidv4() + '.' + fileExt;
                        const videoPath = join(__dirname, '..', '..', '..', 'files', 'posts_videos', filename);
                        await videoStream.pipe(fs.createWriteStream(videoPath));
                        return videoPath;
                    }));
                }
            } catch(err){
                console.log(err)
            }
            if(desc && (desc.length < 1 || desc.length > 2500))
                throw ApiError.badRequest('Длина описания должна быть до 2500 символов');
            const newPost = await resp.locals.user.createPost({
                videos: videosPath,
                desc,
                imgs: imgsPath,
            });
            return newPost;
        } catch(err){
            errorHandler(err);
        }
    },

    async updatePost(_:any, {postId, post: updatePostData}: {postId: number, post: InputPost}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Пост не найден');

            if(resp.locals.user.id != post.user && resp.locals.user.role !== 'admin')
                throw ApiError.forbidden();

            if(updatePostData.desc.length < 1 || updatePostData.desc.length > 2500)
                throw ApiError.badRequest('Длина описания должна быть до 2500 символов');

            await post.update(updatePostData);
            return post;
        } catch(err){
            errorHandler(err);
        }
    },

    async deletePost(_:any, {postId}: {postId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Пост не найден');

            if(resp.locals.user.id != post.user && resp.locals.user.role !== 'admin')
                throw ApiError.forbidden();

            await post.destroy();
            return post;
        } catch(err){
            errorHandler(err);
        }
    },

    async likePost(_: any, {postId}: {postId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Пост не найден');

            const userId = resp.locals.user.id;
            if(post.likes.includes(userId)){
                await post.update({
                    likes: post.likes.filter(userId => userId != resp.locals.user.id)
                });
            } 
            else{
                post.likes = [...post.likes, userId];
                await post.save();
            }

            return true;
        } catch(err){
            errorHandler(err);
        }
    }
};