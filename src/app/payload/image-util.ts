export class ImageUtil {

    BASE_URL = "http://localhost:8080/rise";
    imageUrl = this.BASE_URL + '/auth/file/getImageApi/UserProfile/';

    fileAccess = this.BASE_URL +'/auth/file/getImageApi'
    getImageUrl(){
        return this.imageUrl;
    }

    getFileAccess(){
        return this.fileAccess;
    }
}
