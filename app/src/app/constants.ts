export class Constants {
    public static readonly  url_users = 'users';
    public static readonly  url_hosts = 'hosts';
    public static readonly  url_visits = 'visits';
    public static readonly  url_conversations = 'conversations';
    public static readonly  url_comments = 'comments';

    public static readonly NO_USER = -1;

    public static readonly ALL_VISITS = -1;

    // For Restful response
    public static readonly RESPONSE_CODE = 'responseCode';
    public static readonly MESSAGE = 'message';
    public static readonly CONTENT = 'content';
    public static readonly RESPONSE_OK = 200;

    // For Cookie
    public static readonly COOKIE_USER_ID = 'user_id';
    public static readonly COOKIE_USER_NAME = 'user_name';
    public static readonly COOKIE_THUMB_URL = 'thumb_url';

    //For Dialog option
    public static readonly DIALOG_OPTION_POSITIVE = 1;
    public static readonly DIALOG_OPTION_NEGATIVE = 2;
}

export class UserConsts {
    public static readonly KEY_USER_ID = "user_id";
    public static readonly KEY_USER_NAME = "user_name";
    public static readonly KEY_THUMB_URL = "thumb_url";
    public static readonly KEY_ACCESS_TOKEN = "access_token";

    // All data that user comes to host
    public static readonly KEY_CONVERSATIONS_HOST = "convs_host";

    // All data that user comes to Guest
    public static readonly KEY_CONVERSATIONS_GUEST = "convs_guest";
    public static readonly KEY_USER_PROPERTIES = "user_properties";
    public static readonly KEY_PLANS = "key_plans";



}

export class VisitConsts {
    public static readonly KEY_VISIT_ID = "visit_id";
    public static readonly KEY_USER_ID = "user_id";
    public static readonly KEY_USER_NAME = "user_name";
    public static readonly KEY_THUMB_URL = "thumb_url";
    public static readonly KEY_PLACE = "place";
    public static readonly KEY_START = "start";
    public static readonly KEY_END = "end";
    public static readonly KEY_COMMENT = "comment";
    public static readonly KEY_PROBLEMS = "problems";

}

export class HostConsts {
    // Host information
    public static readonly KEY_USER_ID = "user_id";
    public static readonly KEY_USER_NAME = "user_name";
    public static readonly KEY_THUMB_URL = "thumb_url";

}

export class ConversationConsts {

    public static readonly KEY_CONVERSATION_ID = "conversation_id";
    public static readonly KEY_HOST_ID = "host_id";
    public static readonly KEY_HOST_NAME = "host_name";
    public static readonly KEY_HOST_THUMB_URL = "host_thumb_url";
    public static readonly KEY_VISITOR_ID = "visitor_id";
    public static readonly KEY_VISITOR_NAME = "visitor_name";
    public static readonly KEY_VISITOR_THUMB_URL = "visitor_thumb_url";
    public static readonly KEY_MESSAGES = "messages";
    public static readonly KEY_MESSAGES_SENDER_ID = "msg_sender_id";
    public static readonly KEY_MESSAGES_SENDER_NAME = "msg_sender_name";
    public static readonly KEY_MESSAGES_SENDER_THUMB_URL = "msg_sender_tu";
    public static readonly KEY_MESSAGES_SEND_TIME = "msg_sende_time";
    public static readonly KEY_MESSAGES_CONTENT = "msg_content";
    public static readonly KEY_MESSAGES_TIMESTAMP = "msg_time";
    public static readonly KEY_MESSAGES_LATEST_TIMESTAMP = "msg_latest_time";

}