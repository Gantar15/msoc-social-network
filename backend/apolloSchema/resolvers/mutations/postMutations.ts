
import errorHandler from '../../../lib/errorHandler';
import ApiError from '../../../lib/ApiError';
import Post from '../../../models/Post';
import type {IApolloContext} from '../../../types/IApolloContext';
import { checkAuth } from '../../../middlewares/auth-middleware';


interface InputPost{
    desc: string;
    imgs: string[];
}

export default {
    async createPost(_:any, {desc, imgs}: {desc: string, imgs: string[]}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            if(desc.length < 1 || desc.length > 2500)
                throw ApiError.badRequest('Длина описания должна быть до 2500 символов');
            const newPost = await resp.locals.user.createPost({
                desc,
                imgs
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