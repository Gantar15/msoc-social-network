
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";


interface IVideoRoom{
    id?: number;
    users: number[];
}
export type {IVideoRoom};

interface TokenCreationAttributes extends Optional<IVideoRoom, "id"> {}
class VideoRoom extends Model<IVideoRoom, TokenCreationAttributes> implements IVideoRoom {
    public id!: number;
    public users!: number[];
}
VideoRoom.init({
    users: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }
},{
    sequelize
});

export default VideoRoom;