
interface IUserDto{
    name: string,
    email: string,
    isActivated: boolean,
    id: number
}
export type {IUserDto};

export default class UserDto{
    email: string;
    isActivated: boolean;
    name: string;
    id: number;

    constructor(model: IUserDto){
        this.id = model.id;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.name = model.name;
    }
}