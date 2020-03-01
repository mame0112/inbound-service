export class Conversation {

    conversation_id: number;
    host_id: number;
    host_name: string;
    host_thumb_url : string;
    visitor_id: number;
    visitor_name: string;
    visitor_thumb_url: string;
    messages: object[];
    visit_id: number;


    constructor(){}

    setConversationId(conversation_id: number): void {
        this.conversation_id = conversation_id;
    }

    setHostUserId(host_id: number): void {
        this.host_id = host_id;
    }

    setHostUserName(host_name: string): void {
        this.host_name = host_name;
    }

    setHostThumbUrl(host_thumb_url: string): void {
        this.host_thumb_url = host_thumb_url;        
    }

    setVisitorUserId(visitor_id: number): void {
        this.visitor_id = visitor_id;
    }

    setVisitorUserName(visitor_name: string): void {
        this.visitor_name = visitor_name;
    }

    setVisitorThumbUrl(visitor_thumb_url: string): void {
        this.visitor_thumb_url = visitor_thumb_url;        
    }

    setMessages(messages?: object[]): void {
        this.messages = messages;
    }

    setVisitId(visit_id: number): void {
        this.visit_id = visit_id;
    }

    addMessage(message: object): void {
        this.messages.push(message);
    }

    getConversationId(): number {
        return this.conversation_id;
    }

    getHostUserId(): number {
        return this.host_id;
    }

    getHostUserName(): string {
        return this.host_name;
    }

    getHostThumbUrl(): string {
        return this.host_thumb_url;
    }

    getVisitorUserId(): number {
        return this.visitor_id;
    }

    getVisitorUserName(): string {
        return this.visitor_name;
    }

    getVisitorThumbUrl(): string {
        return this.visitor_thumb_url;
    }

    getMessages(): any {
        return this.messages;
    }

    getVisitId(): number {
        return this.visit_id;
    }

    
}