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