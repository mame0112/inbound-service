class Consts:
    IS_DEBUG = False
    NO_USER = -1
    # IS_DEBUG = True


class User:
    KIND_NAME = "user"
    KEY_USER_ID = "user_id"
    KEY_USER_NAME = "user_name"
    KEY_THUMB_URL = "thumb_url"
    KEY_ACCESS_TOKEN = "access_token"
    KEY_CONVERSATIONS = "conversations"
    KEY_USER_PROPERTIES = "user_properties"
    KEY_PLANS = "key_plans"


class Conversation:
    KIND_NAME = "conversation"
    KEY_CONVERSATION_ID = "conversation_id"
    KEY_HOST_ID = "host_id"
    KEY_HOST_NAME = "host_name"
    KEY_HOST_THUMB_URL = "host_thumb_url"
    KEY_VISITOR_ID = "visitor_id"
    KEY_VISITOR_NAME = "visitor_name"
    KEY_VISITOR_THUMB_URL = "visitor_thumb_url"
    KEY_MESSAGES = "messages"


class Host:
    KEY_NAME = "host"
    KEY_USER_ID = "user_id"
    KEY_USER_NAME = "user_name"
    KEY_THUMB_URL = "thumb_url"


class Visit:
    KIND_NAME = "visit"
    KEY_USER_ID = "user_id"
    KEY_USER_NAME = "user_name"
    KEY_THUMB_URL = "thumb_url"
    KEY_PLAN = "plan"


class HttpResponseCode:
    OK = 200
    NO_CONTENT = 204
    BAD_REQUEST = 400
    FORBIDDEN = 403
    NOT_FOUND = 404
