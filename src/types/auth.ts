export interface User {
    id: number,
    username: string,
    email: string,
    avatar: string,
    birthday: string,
    gender: number,
    blacklist:string,
    confirmer: boolean,
    createAt: string,
    rolesId: number[]
}
export interface avatarUpdate {
    id: string
    avatar: string
}
export interface IUserListI {
    id: number;
    username: string;
    email: string;
    birthday: Date;
    gender: number;
    blacklist: boolean;
    confirmed: boolean;
    createdAt: Date;
}