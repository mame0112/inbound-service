import { Conversation } from '../conversation';

export class ConversationDataBuilder {

    conversation = new Conversation()

    constructor() {
        // Nothing to do
    }


    setConversationId(conversation_id: number): ConversationDataBuilder {
        this.conversation.setConversationId(conversation_id);
        return this;
    }

    setHostUserId(host_id: string): ConversationDataBuilder {
        this.conversation.setHostUserId(host_id);
        return this;
    }

    setHostUserName(host_name: string): ConversationDataBuilder {
        this.conversation.setHostUserName(host_name);
        return this;
    }

    setHostThumbUrl(host_thumb_url: string): ConversationDataBuilder {
        this.conversation.setHostThumbUrl(host_thumb_url);
        return this;
    }

    setVisitorUserId(visitor_id: string): ConversationDataBuilder {
        this.conversation.setVisitorUserId(visitor_id);
        return this;
    }

    setVisitorUserName(visitor_name: string): ConversationDataBuilder {
        this.conversation.setVisitorUserName(visitor_name);
        return this;
    }

    setVisitorThumbUrl(visitor_thumb_url: string): ConversationDataBuilder {
        this.conversation.setVisitorThumbUrl(visitor_thumb_url);
        return this;
    }

    setMessages(messages?: any): ConversationDataBuilder {
        this.conversation.setMessages(messages);
        return this;
    }

    setVisitId(visit_id: number): ConversationDataBuilder {
        this.conversation.setVisitId(visit_id);
        return this;
    }

    getResult(): Conversation{
        return this.conversation;
    }

}