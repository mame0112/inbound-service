from server.util.logger import Logger

from server.const.const import User


class UserDataBuilder():
    log = Logger("UserDataBuilder")

    data = {}

    def set_user_id(self, user_id):
        self.data[User.KEY_USER_ID] = user_id
        return self

    def set_user_name(self, user_name):
        self.data[User.KEY_USER_NAME] = user_name
        return self

    def set_thumb_url(self, thumb_url):
        self.data[User.KEY_THUMB_URL] = thumb_url
        return self

    def set_access_token(self, access_token):
        self.data[User.KEY_ACCESS_TOKEN] = access_token
        return self

    # def set_access_token_expire_time(self, access_token_expire_time):
    #     self.data[User.KEY_ACCESS_TOKEN_EXPIRE_TIME] = access_token_expire_time
    #     return self

    def set_convs_host(self, convs_host):
        self.data[User.KEY_CONVERSATIONS_HOST] = convs_host
        return self

    def set_convs_guest(self, convs_guest):
        self.data[User.KEY_CONVERSATIONS_GUEST] = convs_guest
        return self

    def set_user_properties(self, user_properties):
        self.data[User.KEY_USER_PROPERTIES] = user_properties
        return self

    def set_plans(self, plans):
        self.data[User.KEY_PLANS] = plans
        return self

    def set_psid(self, psid):
        self.data[User.KEY_PSID] = psid
        return self

    def get_result(self):
        return self.data
