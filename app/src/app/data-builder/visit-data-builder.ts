import { Visit } from '../visit';

export class VisitDataBuilder {

    visit = new Visit()

    constructor() {
        // Nothing to do
    }

    setVisitId(visit_id: number): VisitDataBuilder {
        this.visit.setVisitId(visit_id);
        return this;
    }

    setUserId(user_id: number): VisitDataBuilder {
        this.visit.setUserId(user_id);
        return this;
    }

    setUserName(user_name: string): VisitDataBuilder {
        this.visit.setUserName(user_name);
        return this;
    }

    setThumbUrl(thumb_url: string): VisitDataBuilder {
        this.visit.setThumbUrl(thumb_url);
        return this;        
    }

    setPlace(place: string): VisitDataBuilder {
        this.visit.setPlace(place);
        return this;
    }

    setStart(start: string): VisitDataBuilder {
        this.visit.setStart(start);
        return this;
    }

    setEnd(end: string): VisitDataBuilder {
        this.visit.setEnd(end);
        return this;
    }

    setComment(comment?: string): VisitDataBuilder {
        this.visit.setComment(comment);
        return this;
    }

    getResult(): Visit{
        return this.visit
    }

}