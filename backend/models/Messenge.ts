
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";


interface IMessenge{
    id?: number;
    authorId: number;
    text: string;
}


interface TokenCreationAttributes extends Optional<IMessenge, "id"> {}
class Messenge extends Model<IMessenge, TokenCreationAttributes> implements IMessenge {
    public id!: number;
    public authorId!: number;
    public text!: string;
}
Messenge.init({
    authorId: DataTypes.INTEGER,
    text: DataTypes.STRING
},{
    sequelize
});

export default Messenge;