
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";


interface IPost{
    id?: number;
    user?: string;
    desc: string;
    imgs: string[];
    videos: string[];
    likes: number[];
}


interface TokenCreationAttributes extends Optional<IPost, "id" | "user"> {}
class Post extends Model<IPost, TokenCreationAttributes> implements IPost {
    public id!: number;
    public user!: string;
    public desc!: string;
    public imgs!: string[];
    public videos!: string[];
    public likes!: number[];
}
Post.init({
    desc: {
        type: DataTypes.STRING,
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
    likes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }
},{
    sequelize
});

export default Post;