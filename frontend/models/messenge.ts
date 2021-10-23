
interface IMessenge{
    id: number;
    text: string;
    authorId: number;
    recipientId: number;
    createdAt: string;
    updatedAt: string;
    videos: string[];
    imgs: string[];
    audios: string[];
    documents: {filename: string, codedFilename: string}[];
}
export type {IMessenge};