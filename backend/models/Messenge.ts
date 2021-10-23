
import sequelize from "../db";
import { DataTypes, Optional, 
    Model,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin} from "sequelize";
import AccordFile from "./AccordFile";


interface IMessenge{
    id?: number;
    authorId: number;
    recipientId: number;
    text: string;
    imgs: string[];
    videos: string[];
    audios: string[];
}
export type {IMessenge};

interface TokenCreationAttributes extends Optional<IMessenge, "id"> {}
class Messenge extends Model<IMessenge, TokenCreationAttributes> implements IMessenge {
    public id!: number;
    public authorId!: number;
    public recipientId!: number;
    public text!: string;
    public imgs!: string[];
    public videos!: string[];
    public audios!: string[];
    
    public getAccordFiles!: HasManyGetAssociationsMixin<AccordFile>;
    public createAccordFile!: HasManyCreateAssociationMixin<AccordFile>;
}
Messenge.init({
    authorId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    text: DataTypes.STRING,
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
    }
},{
    sequelize
});

Messenge.hasMany(AccordFile);

export default Messenge;