import { Host } from '../host';

export class HostDataBuilder {

    host = new Host()

    constructor() {
        // Nothing to do
    }

    setUserId(user_id: string): HostDataBuilder {
        this.host.setUserId(user_id);
        return this;
    }

    setUserName(user_name: string): HostDataBuilder {
        this.host.setUserName(user_name);
        return this;
    }

    setThumbUrl(thumb_url: string): HostDataBuilder {
        this.host.setThumbUrl(thumb_url);
        return this;        
    }

    getResult(): Host{
        return this.host;
    }

}