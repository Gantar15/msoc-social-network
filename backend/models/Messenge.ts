
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";


interface IMessenge{
    id?: number;
    authorId: number;
    recipientId: number;
    text: string;
}
export type {IMessenge};

interface TokenCreationAttributes extends Optional<IMessenge, "id"> {}
class Messenge extends Model<IMessenge, TokenCreationAttributes> implements IMessenge {
    public id!: number;
    public authorId!: number;
    public recipientId!: number;
    public text!: string;
}
Messenge.init({
    authorId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    text: DataTypes.STRING
},{
    sequelize
});

export default Messenge;