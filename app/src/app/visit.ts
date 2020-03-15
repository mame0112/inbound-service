export class Visit {

    visit_id: number;
    user_id: string;
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

    setUserId(user_id: string): void {
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


    getVisitId(): number {
        return this.visit_id;
    }

    getUserId(): string {
        return this.user_id;
    }

    getUserName(): string {
        return this.user_name;
    }

    getThumbUrl(): string {
        return this.thumb_url;
    }

    getPlace(): string {
        return this.place;
    }

    getStart(): string {
        return this.start;
    }

    getEnd(): string {
        return this.end;
    }

    getComment(): string {
        return this.comment;
    }


    
}