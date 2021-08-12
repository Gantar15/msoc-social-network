
import { DataTypes, Optional, Model,
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Association } from "sequelize";
import sequelize from "../db";
import Token from './Token';

interface IUser{
    name: string,
    email: string,
    password: string,
    profilePicture: string,
    coverPicture: string,
    followers: string[],
    followins: string[],
    role: 'user' | 'admin' | 'moderator',
    id?: number,
    isActivated: boolean,
    activationLink: string,
    desc: string,
    city: string,
    from: string,
    relationship: 1|2|3
}
export type {IUser};

interface UserCreationAttributes extends Optional<IUser, "id" | 'activationLink' 
| 'isActivated' | 'role' 
| 'followins' | 'followers' 
| 'coverPicture' | 'profilePicture'
| 'desc' | 'city' | 'from' | 'relationship'> {}
class User extends Model<IUser, UserCreationAttributes> implements IUser {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public profilePicture!: string;
    public coverPicture!: string;
    public followers!: string[];
    public followins!: string[];
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
    coverPicture: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    followers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    followins: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
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
    relationship: DataTypes.ENUM('1','2','3')
},{
    tableName: 'Users',
    sequelize
});

User.hasOne(Token, {foreignKey: 'user'});

export default User;