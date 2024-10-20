import http from "../untils/axiosInstance"

const categoryApiRequest ={
    getAll: async() =>{
        const response = await http.get<any>(
            '/category'
        );
        return response
    },
    getCategoryListInNovels: async(categoryId:number)=>{
        const response = await http.get<any>(
            `/category/novel/${categoryId}`
        );
        return response
    },
    deleteCategoryOfUser: async(userId: number,categoryId: number) =>{
        const response = await http.delete<any>(
            `/category/${userId}`,
            categoryId
        )
    },
    addCategory: async(userId:number, name: string|undefined, description: string|undefined)=>{
         const response = await http.post<any>(
            `/category`,
            {userId,name,description}
        )
    },
    updateCategory :async(categoryId: number|undefined,userId:number, name: string|undefined, description: string|undefined) =>{
        const response = await http.patch<any>(
            `/category/${categoryId}`,
             {userId,name,description}
        )
    },
}
export default categoryApiRequest