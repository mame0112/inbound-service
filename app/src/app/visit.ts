export class Visit {

    visit_id: number;
    user_id: number;
    user_name: string;
    thumb_url: string;
    place: string;
    start: string;
    end: string;
    comment?: string;

    constructor(){}

    setVisitId(visit_id: number): void {
        this.visit_id = visit_id;
    }

    setUserId(user_id: number): void {
        this.user_id = user_id;
    }

    setUserName(user_name: string): void {
        this.user_name = user_name;
    }

    setThumbUrl(thumb_url: string): void {
        this.thumb_url = thumb_url;        
    }

    setPlace(place: string): void {
        this.place = place;
    }

    setStart(start: string): void {
        this.start = start
    }

    setEnd(end: string): void {
        this.end = end;
    }

    setComment(comment?: string): void {
        this.comment = comment;
    }


    // constructor(
    //     public visit_id: number,
    //     public user_id: number,
    //     public user_name: string,
    //     public thumb_url: string,
    //     public place: string,
    //     public start: string,
    //     public end: string,
    //     public comment?: string){}
    
}