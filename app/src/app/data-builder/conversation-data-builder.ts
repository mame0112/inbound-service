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

    setCurrentUserId(current_user_id: string): ConversationDataBuilder {
        this.conversation.setCurrentUserId(current_user_id);
        return this;
    }

    setVisitStart(start: string): ConversationDataBuilder{
        this.conversation.setVisitStart(start);
        return this;
    }

    setVisitEnd(end: string): ConversationDataBuilder{
        this.conversation.setVisitEnd(end);
        return this;
    }

    setVisitComment(comment: string): ConversationDataBuilder{
        this.conversation.setVisitComment(comment);
        return this;
    }

    setVisitProblems(problems: string[]): ConversationDataBuilder{
        this.conversation.setVisitProblems(problems);
        return this;
    }

    setVisitPlace(place: string): ConversationDataBuilder{
        this.conversation.setVisitPlace(place);
        return this;
    }

    getResult(): Conversation{
        return this.conversation;
    }

}