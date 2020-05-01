class Consts:
    IS_DEBUG = False
    NO_USER = -1
    NO_PSID = -1
    ALL_VISITS = -1
    VISIT_QUERY_NUM = 3


class User:
    KIND_NAME = "user"
    KEY_USER_ID = "user_id"
    KEY_USER_NAME = "user_name"
    KEY_THUMB_URL = "thumb_url"
    KEY_ACCESS_TOKEN = "access_token"
    KEY_ACCESS_TOKEN_EXPIRE_TIME = "access_token_expire_time"
    KEY_CONVERSATIONS_HOST = "convs_host"
    KEY_CONVERSATIONS_GUEST = "convs_guest"
    KEY_USER_PROPERTIES = "user_properties"
    KEY_PLANS = "plans"
    KEY_PSID = "psid"


class Conversation:
    KIND_NAME = "conversation"
    KEY_CONVERSATION_ID = "conversation_id"
    KEY_HOST_ID = "host_id"
    KEY_HOST_NAME = "host_name"
    KEY_HOST_THUMB_URL = "host_thumb_url"
    KEY_VISITOR_ID = "visitor_id"
    KEY_VISIT_ID = "visit_id"
    KEY_VISITOR_NAME = "visitor_name"
    KEY_VISITOR_THUMB_URL = "visitor_thumb_url"
    KEY_CURRENT_USER_ID = "current_user_id"
    KEY_MESSAGES = "messages"
    KEY_MESSAGES_SENDER_ID = "msg_sender_id"
    KEY_MESSAGES_SENDER_NAME = "msg_sender_name"
    KEY_MESSAGES_SENDER_THUMB_URL = "msg_sender_tu"
    KEY_MESSAGES_SEND_TIME = "msg_sende_time"
    KEY_MESSAGES_CONTENT = "msg_content"
    KEY_MESSAGES_TIMESTAMP = "msg_time"
    KEY_MESSAGES_LATEST_TIMESTAMP = "msg_latest_time"


class Host:
    KIND_NAME = "host"
    KEY_USER_ID = "user_id"
    KEY_USER_NAME = "user_name"
    KEY_THUMB_URL = "thumb_url"


class Visit:
    KIND_NAME = "visit"
    KEY_VISIT_ID = "visit_id"
    KEY_USER_ID = "user_id"
    KEY_USER_NAME = "user_name"
    KEY_THUMB_URL = "thumb_url"
    KEY_PLACE = "place"
    KEY_START = "start"
    KEY_END = "end"
    KEY_COMMENT = "comment"
    KEY_PROBLEMS = "problems"


# This kind is for check which visitor / host has already been done. And
# this should not be visible from client side.
class State:
    KIND_NAME = "state"
    KEY = "key"
    KEY_VISIT_DONE = "visit_done"
    KEY_VISIT_WAIT = "visit_wait"
    KEY_HOST_WAIT = "host_wait"


class HttpResponseCode:
    OK = 200
    NO_CONTENT = 204
    BAD_REQUEST = 400
    FORBIDDEN = 403
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500
