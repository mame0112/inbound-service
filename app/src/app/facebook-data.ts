export class FacebookData {

    constructor(private _category: Category, private _content :any){

    }


    getCategory(): Category{
        return this._category;
    }

    getContent(){
        return this._content;
    }

    setCategory(value: Category){
        this._category = value;
    }

    setContent(value: any){
        this._content = value;
    }

}

export enum Category  {    
    ALREADY_LOGGED_IN,
    NOT_LOGGED_IN,
    SEND_TO_MESSENGER

}

