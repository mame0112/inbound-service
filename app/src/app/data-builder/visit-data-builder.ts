import { Visit } from '../visit';

export class VisitDataBuider {

    visit = new Visit()

    constructor() {
        // Nothing to do
    }

    setVisitId(visit_id: number): VisitDataBuider {
        this.visit.setVisitId(visit_id);
        return this;
    }

    setUserId(user_id: number): VisitDataBuider {
        this.visit.setUserId(user_id);
        return this;
    }

    setUserName(user_name: string): VisitDataBuider {
        this.visit.setUserName(user_name);
        return this;
    }

    setThumbUrl(thumb_url: string): VisitDataBuider {
        this.visit.setThumbUrl(thumb_url);
        return this;        
    }

    setPlace(place: string): VisitDataBuider {
        this.visit.setPlace(place);
        return this;
    }

    setStart(start: string): VisitDataBuider {
        this.visit.setStart(start);
        return this;
    }

    setEnd(end: string): VisitDataBuider {
        this.visit.setEnd(end);
        return this;
    }

    setComment(comment?: string): VisitDataBuider {
        this.visit.setComment(comment);
        return this;
    }

    getResult(): Visit{
        return this.visit
    }

}