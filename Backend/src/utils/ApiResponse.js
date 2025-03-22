class ApiResponse{
    constructor(statusCode, data, message="success"){
        this.statusCode = statusCode;
        this.data = data;
        this.messaeg = message;
        this.sucess = statusCode < 400;
    }
}

export {ApiResponse};