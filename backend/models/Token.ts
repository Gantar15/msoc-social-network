
import sequelize from "../db";
import { DataTypes, Optional, 
    Model } from "sequelize";


interface IToken{
    id?: number,
    refreshToken: string,
    user?: number
}


interface TokenCreationAttributes extends Optional<IToken, "id" | "user"> {}
class Token extends Model<IToken, TokenCreationAttributes> implements IToken {
    public id!: number;
    public refreshToken!: string;
    public user!: number;
}
Token.init({
    refreshToken: DataTypes.STRING
},{
    tableName: "Tokens",
    sequelize
});

export default Token;