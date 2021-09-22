
import postQuerys from './querys/postQuerys';
import userQuerys from './querys/userQuerys';
import messengesQuerys from './querys/messengesQuerys';

export default {
    ...userQuerys,
    ...postQuerys,
    ...messengesQuerys
}