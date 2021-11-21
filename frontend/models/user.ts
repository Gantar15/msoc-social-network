
interface IUser{
    name: string,
    email: string,
    password: string,
    profilePicture: string,
    followers: number[],
    followins: number[],
    role: 'user' | 'admin' | 'moderator',
    id: number,
    isActivated: boolean,
    activationLink: string,
    desc: string,
    city: string,
    from: string,
    relationship: 1|2|3
}
export type {IUser};