import messengesSubscriptions from "./subscriptions/messengesSubscriptions";
import videoChatSubscriptions from "./subscriptions/videoChatSubscriptions";


export default {
    ...messengesSubscriptions,
    ...videoChatSubscriptions
}