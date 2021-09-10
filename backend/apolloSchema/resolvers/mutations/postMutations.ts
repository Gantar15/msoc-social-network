import errorHandler from '../../../lib/errorHandler';
import ApiError from '../../../lib/ApiError';
import Post from '../../../models/Post';
import type {IApolloContext} from '../../../types/IApolloContext';
import { checkAuth } from '../../../middlewares/auth-middleware';
import type {FileUpload} from 'graphql-upload';
import {join, parse} from 'path';
import fs from 'fs';
import {Readable} from 'stream';
import {v4 as uuidv4} from 'uuid';
import User from '../../../models/User';


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
                        const fileExt = parse(imageUploadObj.filename).ext;
                        const filename = uuidv4() + fileExt;
                        const imgPath = join(__dirname, '..', '..', '..', 'files', 'posts_imgs', filename);
                        await imgStream.pipe(fs.createWriteStream(imgPath));
                        return `${process.env.SITE_URL}/posts_imgs/${filename}`;
                    }));
                }
                if(videos){
                    videosPath = await Promise.all(videos.map(async (video) => {
                        const videoUploadObj = await video;
                        const videoStream: Readable = videoUploadObj.createReadStream();
                        const fileExt = parse(videoUploadObj.filename).ext;
                        const filename = uuidv4() + fileExt;
                        const videoPath = join(__dirname, '..', '..', '..', 'files', 'posts_videos', filename);
                        await videoStream.pipe(fs.createWriteStream(videoPath));
                        return `${process.env.SITE_URL}/posts_videos/${filename}`;
                    }));
                }
            } catch(err){
                console.log(err)
            }
            const newPost = await resp.locals.user.createPost({
                videos: videosPath,
                desc,
                imgs: imgsPath,
            });
            const user: any = await User.findByPk(newPost.user);

            return {
                ...newPost.dataValues,
                user: user!.dataValues
            };
        } catch(err: any){
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
        } catch(err: any){
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
        } catch(err: any){
            errorHandler(err);
        }
    },

    async likePost(_: any, {postId}: {postId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Пост не найден');

            const authUserId = resp.locals.user.id;
            if(post.likes.includes(authUserId)){
                await post.update({
                    likes: post.likes.filter(user => user != authUserId)
                });
            } 
            else{
                if(post.dislikes.includes(authUserId)){
                    await post.update({
                        dislikes: post.dislikes.filter(user => user != authUserId)
                    });
                }
                post.likes = [...post.likes, authUserId];
                await post.save();
            }

            return true;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async dislikePost(_: any, {postId}: {postId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Пост не найден');

            const authUserId = resp.locals.user.id;
            if(post.dislikes.includes(authUserId)){
                await post.update({
                    dislikes: post.dislikes.filter(user => user != authUserId)
                });
            }
            else{
                if(post.likes.includes(authUserId)){
                    await post.update({
                        likes: post.likes.filter(user => user != authUserId)
                    });
                } 
                post.dislikes = [...post.dislikes, authUserId];
                await post.save();
            }

            return true;
        } catch(err: any){
            errorHandler(err);
        }
    }
};