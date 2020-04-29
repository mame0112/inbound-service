export class User {

    user_id: string;
    user_name: string;
    thumb_url: string;
    access_token: string;
    host_conversations: string;
    guest_conversations: string;
    user_properties: string;
    plans: string;

    constructor(){}


    setUserId(user_id: string): void {
        this.user_id = user_id;
    }

    setUserName(user_name: string): void {
        this.user_name = user_name;
    }

    setThumbUrl(thumb_url: string): void {
        this.thumb_url = thumb_url;        
    }

    setAccessToken(access_token: string): void {
        this.access_token = access_token;
    }

    setHostConversations(conversations?: string): void {
        this.host_conversations = conversations;
    }

    setGuestConversations(conversations?: string): void {
        this.guest_conversations = conversations;
    }

    setUserProperties(user_properties?: string): void {
        this.user_properties = user_properties;
    }

    setPlans(plans?: string): void {
        this.plans = plans;
    }


    getUserId(): string {
        console.log(this.user_id);
        return this.user_id;
    }

    getUserName(): string {
        return this.user_name;
    }

    getThumbUrl(): string {
        return this.thumb_url;
    }

    getAccessToken(): string {
        return this.access_token;
    }

    getHostConversations(): string {
        return this.host_conversations;
    }

    getGuestConversations(): string {
        return this.guest_conversations;
    }

    getUserProperties(): string {
        return this.user_properties;
    }

    getPlans(): string {
        return this.plans;
    }
    
}