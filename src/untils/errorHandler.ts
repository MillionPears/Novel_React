// errorHandler.ts
export const handleApiError = (error: any) => {
    // Xử lý lỗi theo cách bạn muốn
    let errorMessage = 'Có lỗi xảy ra.';
    
    if (error.response) {
        errorMessage = error.response.data.message || 'Có lỗi xảy ra từ server.';
        console.error('Error from server: ', error.response.data);
    } else if (error.request) {
        errorMessage = 'Không nhận được phản hồi từ server. Vui lòng thử lại.';
    } else {
        errorMessage = 'Có lỗi trong việc cấu hình yêu cầu.';
    }
    
    // Ném lỗi hoặc xử lý theo cách bạn muốn
    throw new Error(errorMessage);
};
