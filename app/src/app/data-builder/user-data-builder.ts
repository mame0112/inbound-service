import { User } from '../user';

export class UserDataBuilder {

    user = new User()

    constructor() {
        // Nothing to do
    }

    setUserId(user_id: string): UserDataBuilder {
        console.log(user_id);
        this.user.setUserId(user_id);
        return this;
    }

    setUserName(user_name: string): UserDataBuilder {
        this.user.setUserName(user_name);
        return this;
    }

    setThumbUrl(thumb_url: string): UserDataBuilder {
        this.user.setThumbUrl(thumb_url);
        return this;
    }


    setAccessToken(access_token: string): UserDataBuilder {
        this.user.setAccessToken(access_token);
        return this;
    }

    setHostConversations(conversations?: string): UserDataBuilder {
        this.user.setHostConversations(conversations);
        return this;
    }

    setGuestConversations(conversations?: string): UserDataBuilder {
        this.user.setGuestConversations(conversations);
        return this;
    }

    setUserProperties(user_properties?: string): UserDataBuilder {
        this.user.setUserProperties(user_properties);
        return this;
    }

    setPlans(plans?: string): UserDataBuilder {
        this.setPlans(plans);
        return this;
    }

    getResult(): User{
        return this.user;
    }

}