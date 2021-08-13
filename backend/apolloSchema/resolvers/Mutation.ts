
import authMutations from './mutations/authMutations';
import userMutations from './mutations/userMutations';
import postMutations from './mutations/postMutations';

export default {
    ...authMutations,
    ...userMutations,
    ...postMutations
};