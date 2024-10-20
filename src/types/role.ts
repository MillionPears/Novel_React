import { IPermissionI } from "../hooks/usePermission";

export interface IRoleI {
    id: number;
    name: string;
    description: string;
    permissions: IPermissionI[]
}
