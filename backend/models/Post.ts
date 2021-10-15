
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";


interface IPost{
    id?: number;
    user?: string;
    desc: string;
    imgs: string[];
    videos: string[];
    audios: string[];
    likes: number[];
    dislikes: number[];
    shareCount: number;
    comments: number[];
}


interface TokenCreationAttributes extends Optional<IPost, "id" | "user"> {}
class Post extends Model<IPost, TokenCreationAttributes> implements IPost {
    public id!: number;
    public user!: string;
    public desc!: string;
    public imgs!: string[];
    public videos!: string[];
    public audios!: string[];
    public likes!: number[];
    public dislikes!: number[];
    public shareCount!: number;
    public comments!: number[];
}
Post.init({
    desc: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imgs: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    videos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },    
    audios: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    likes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    },
    dislikes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    },
    shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comments: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }
},{
    sequelize
});

export default Post;