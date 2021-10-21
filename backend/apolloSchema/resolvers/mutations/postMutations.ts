import errorHandler from '../../../lib/errorHandler';
import ApiError from '../../../lib/ApiError';
import Post from '../../../models/Post';
import type {IApolloContext} from '../../../types/IApolloContext';
import { checkAuth } from '../../../middlewares/auth-middleware';
import type {FileUpload} from 'graphql-upload';
import User from '../../../models/User';
import saveFilesFromStream from '../../../lib/saveFilesFromStream';


interface InputUpdatePost{
    desc: string;
    imgs: string[];
    videos: string[];
    audios: string[];
}
interface InputCreatePost{
    desc: string | null;
    imgs: Promise<FileUpload>[] | null;
    videos: Promise<FileUpload>[] | null;
    audios: Promise<FileUpload>[] | null;
}

export default {
    async createPost(_:any, {desc, imgs, videos, audios}: InputCreatePost, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            let imgsPath: string[] = [];
            let videosPath: string[] = [];
            let audiosPath: string[] = [];
            try{
                if(imgs){
                    imgsPath = await saveFilesFromStream(imgs, 'posts_imgs');
                }
                if(videos){
                    videosPath = await saveFilesFromStream(videos, 'posts_videos');
                }
                if(audios){
                    audiosPath = await saveFilesFromStream(audios, 'posts_audios');
                }
            } catch(err){
                console.log(err)
            }
            const newPost = await resp.locals.user.createPost({
                videos: videosPath,
                desc,
                imgs: imgsPath,
                audios: audiosPath
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

    async updatePost(_:any, {postId, post: updatePostData}: {postId: number, post: InputUpdatePost}, {resp}: IApolloContext){
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