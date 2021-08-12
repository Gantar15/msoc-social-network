
import authMutations from './mutations/authMutations';
import userMutations from './mutations/userMutations';

export default {
    ...authMutations,
    ...userMutations
};