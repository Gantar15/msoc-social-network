
import authMutations from './mutations/authMutations';
import userMutations from './mutations/userMutations';
import postMutations from './mutations/postMutations';
import messengesMutation from './mutations/messengesMutation';
import videoChatMutations from './mutations/videoChatMutations';

export default {
    ...authMutations,
    ...userMutations,
    ...postMutations,
    ...messengesMutation,
    ...videoChatMutations
};