
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import permissionApiRequest from "../apiRequest/permission";
import { RootState } from "../store/store";

export interface IPermissionI {
    id: number;
    name: string;
    description: string;
}

export const useUserPermission = () => {
    const user = useSelector((state: RootState) => state.auth.user);
  
    const [permissions, setPermissions] = useState<IPermissionI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchPermissions = async () => {
        if (user?.id) {
          try {
            const response = await permissionApiRequest.getPermissionOfUser(user.id);
            // Giả sử response.data là một mảng các mảng quyền
            const allPermissions = response.data.flat(); // Kết hợp tất cả các mảng thành một mảng duy nhất
            setPermissions(allPermissions);
          } catch (error: any) {
            setError(error.message || 'Đã xảy ra lỗi khi lấy dữ liệu');
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
          setError('Người dùng không hợp lệ');
        }
      };
  
      fetchPermissions();
    }, [user?.id]);
  
    return { permissions, loading, error };
  };

export const useRolePermission = (roleId: string | undefined) => {
    const user = useSelector((state: RootState) => state.auth.user);

    const [permissions, setPermissions] = useState<IPermissionI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const fetchPermissions = useCallback(async () => {
        if (user?.id && roleId) {
            try {
                const response = await permissionApiRequest.getPermissionOfRole(user.id);
                setPermissions(response.data);
            } catch (error: any) {
                setError(error.message || 'Đã xảy ra lỗi khi lấy dữ liệu');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setError('Người dùng không hợp lệ hoặc roleId không hợp lệ');
        }
    }, [user?.id, roleId, shouldRefetch]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    return { permissions, loading, error, refetch: () => setShouldRefetch(prev => !prev) };
};
export const useListPermission = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [permissionsList, setPermissionsList] = useState<IPermissionI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (user?.id) {
                try {
                    const response = await permissionApiRequest.getListPermission(user.id);
                    setPermissionsList(response.data); 
                } catch (error: any) {
                    setError(error.message || 'Đã xảy ra lỗi khi lấy dữ liệu');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setError('Người dùng không hợp lệ');
            }
        };

        fetchPermissions();
    }, [user?.id]);

    return { permissionsList, loading, error };
};