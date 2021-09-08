
interface IPost{
    id: number;
    user: {
      id: number;
      name: string;
      profilePicture: string;
    };
    desc: string;
    imgs: string[];
    likes: number[];
    dislikes: number[];
    comments: number[];
    createdAt: string;
    shareCount: number;
    videos: string[];
}
export type {IPost};