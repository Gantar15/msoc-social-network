
import { DataTypes, Optional, Model,
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasManyGetAssociationsMixin,
    Association } from "sequelize";
import sequelize from "../db";
import Token from './Token';
import Post from './Post';
import Messenge from "./Messenge";

interface IUser{
    name: string,
    email: string,
    password: string,
    profilePicture: string,
    followers?: number[],
    followins?: number[],
    posts?: number[];
    role: 'user' | 'admin' | 'moderator',
    id?: number,
    isActivated: boolean,
    activationLink: string,
    desc: string,
    city: string,
    from: string,
    relationship: 1|2|3
}

interface UserCreationAttributes extends Optional<IUser, "id" | 'activationLink' 
| 'isActivated' | 'role' | 'profilePicture'
| 'desc' | 'city' | 'from' | 'relationship'> {}
class User extends Model<IUser, UserCreationAttributes> implements IUser {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public profilePicture!: string;
    public followers!: number[];
    public followins!: number[];
    public posts!: number[];
    public role!: 'user' | 'admin' | 'moderator';
    public isActivated!: boolean;
    public activationLink!: string;
    public desc!: string;
    public city!: string;
    public from!: string;
    public relationship!: 1|2|3;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public createToken!: HasOneCreateAssociationMixin<Token>;
    public getToken!: HasOneGetAssociationMixin<Token>;
    public setToken!: HasOneSetAssociationMixin<Token, number>;
    public getPosts!: HasManyGetAssociationsMixin<Post>;

    public static associations: {
        token: Association<User, Token>;
    };
}
export type {User};

User.init({
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: [3, 30]
        }
    },
    email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: true
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            len: [6, 256]
        }
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'moderator'),
        defaultValue: 'user'
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activationLink: DataTypes.STRING,
    desc: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [3, 256]
        }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [2, 50]
        }
    },
    from: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [2, 50]
        }
    },
    relationship: DataTypes.ENUM('1','2','3'),
    followers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    },
    followins: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }
},{
    tableName: 'Users',
    sequelize
});


User.hasOne(Token, {foreignKey: 'user'});
User.hasMany(Post, {foreignKey: 'user', as: 'Post'});
// User.belongsToMany(User, {through: Messenge, foreignKey: 'user', targetKey: 'user'});


export default User;