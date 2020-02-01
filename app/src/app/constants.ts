export class Constants {
    public static readonly  url_users = 'users';
    public static readonly  url_hosts = 'hosts';
    public static readonly  url_visits = 'visits';
    public static readonly  url_conversations = 'conversations';

    public static readonly NO_USER = -1;

    public static readonly ALL_VISITS = -1;

    // For Restful response
    public static readonly RESPONSE_CODE = 'responseCode';
    public static readonly MESSAGE = 'message';
    public static readonly CONTENT = 'content';
    public static readonly RESPONSE_OK = 200;

}

export class UserConsts {
    public static readonly KEY_USER_ID = "user_id"
    public static readonly KEY_USER_NAME = "user_name"
    public static readonly KEY_THUMB_URL = "thumb_url"
    public static readonly KEY_ACCESS_TOKEN = "access_token"
    public static readonly KEY_CONVERSATIONS = "conversations"
    public static readonly KEY_USER_PROPERTIES = "user_properties"
    public static readonly KEY_PLANS = "key_plans"

}

export class VisitConsts {
    public static readonly KEY_VISIT_ID = "visit_id"
    public static readonly KEY_USER_ID = "user_id"
    public static readonly KEY_USER_NAME = "user_name"
    public static readonly KEY_THUMB_URL = "thumb_url"
    public static readonly KEY_PLACE = "place"
    public static readonly KEY_START = "start"
    public static readonly KEY_END = "end"
    public static readonly KEY_COMMENT = "comment"

}

export class HostConsts {
    // Host information
    public static readonly KEY_USER_ID = "user_id"
    public static readonly KEY_USER_NAME = "user_name"
    public static readonly KEY_THUMB_URL = "thumb_url"

}

export class ConversationConsts {

    public static readonly KEY_CONVERSATION_ID = "conversation_id"
    public static readonly KEY_HOST_ID = "host_id"
    public static readonly KEY_HOST_NAME = "host_name"
    public static readonly KEY_HOST_THUMB_URL = "host_thumb_url"
    public static readonly KEY_VISITOR_ID = "visitor_id"
    public static readonly KEY_VISITOR_NAME = "visitor_name"
    public static readonly KEY_VISITOR_THUMB_URL = "visitor_thumb_url"
    public static readonly KEY_MESSAGES = "messages"
}