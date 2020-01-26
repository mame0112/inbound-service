import { Host } from '../host';

export class HostDataBuider {

    host = new Host()

    constructor() {
        // Nothing to do
    }

    setUserId(user_id: number): HostDataBuider {
        this.host.setUserId(user_id);
        return this;
    }

    setUserName(user_name: string): HostDataBuider {
        this.host.setUserName(user_name);
        return this;
    }

    setThumbUrl(thumb_url: string): HostDataBuider {
        this.host.setThumbUrl(thumb_url);
        return this;        
    }


    getResult(): Host{
        return this.host
    }

}