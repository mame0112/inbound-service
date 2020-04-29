export class FacebookData {

    constructor(private _category: string, private _content :any){

    }

    get category(){
        return this._category;
    }

    get content(){
        return this._content;
    }

    set category(value: string){
        this._category = value;
    }

    set content(value: any){
        this._content = value;
    }


    // getParam(): Param{
    //     return this.Param;
    // }



}

const Category: string[] = [
    "ALREADY_LOGGED_IN",
    "LOGGIED_IN",
    "NOT_LOGGED_IN",
    "LOGGED_OUT",
    "SEND_TO_MESSENGER"

]

