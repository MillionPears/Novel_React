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
            `/category/novel/${categoryId}`,
            {categoryId}
        );
        return response
    }
}
export default categoryApiRequest