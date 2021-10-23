
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";
import Messenge from "./Messenge";


interface IAccordFile{
    id?: number;
    filename: string;
    codedFilename: string;
}
export type {IAccordFile};

interface TokenCreationAttributes extends Optional<IAccordFile, "id"> {}
class AccordFile extends Model<IAccordFile, TokenCreationAttributes> implements IAccordFile {
    public id!: number;
    public filename!: string;
    public codedFilename!: string;
}
AccordFile.init({
    filename: DataTypes.STRING,
    codedFilename: DataTypes.STRING
},{
    sequelize
});

export default AccordFile;