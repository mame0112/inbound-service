"use strict";
exports.__esModule = true;
var Conversation = /** @class */ (function () {
    function Conversation() {
    }
    Conversation.prototype.setConversationId = function (conversation_id) {
        this.conversation_id = conversation_id;
    };
    Conversation.prototype.setHostUserId = function (host_id) {
        this.host_id = host_id;
    };
    Conversation.prototype.setHostUserName = function (host_name) {
        this.host_name = host_name;
    };
    Conversation.prototype.setHostThumbUrl = function (host_thumb_url) {
        this.host_thumb_url = host_thumb_url;
    };
    Conversation.prototype.setVisitorUserId = function (visitor_id) {
        this.visitor_id = visitor_id;
    };
    Conversation.prototype.setVisitorUserName = function (visitor_name) {
        this.visitor_name = visitor_name;
    };
    Conversation.prototype.setVisitorThumbUrl = function (visitor_thumb_url) {
        this.visitor_thumb_url = visitor_thumb_url;
    };
    Conversation.prototype.setMessages = function (messages) {
        this.messages = messages;
    };
    return Conversation;
}());
exports.Conversation = Conversation;
