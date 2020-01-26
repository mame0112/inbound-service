export class Host {


    user_id: number;
    user_name: string;
    thumb_url: string;

    constructor(){}

    setUserId(user_id: number): void {
        this.user_id = user_id;
    }

    setUserName(user_name: string): void {
        this.user_name = user_name;
    }

    setThumbUrl(thumb_url: string): void {
        this.thumb_url = thumb_url;        
    }


    
}