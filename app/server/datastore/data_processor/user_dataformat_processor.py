import json

from server.const.const import User, Conversation, Host, Visit


class UserDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("UserDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entityToJson(self, entity):
        self.log.debug('entityToJson')

    def jsonToEntity(self, json):
        self.log.debug('jsonToEntity')


class JsonDataBuilder():

    def __init__(self):
        self.log.debug('Initialize')
        self.data = {}

    def set_user_id(self, user_id):
        self.data[const.USER.KEY_USER_ID] = song_id
        return self

    def set_user_name(self, user_name):
        self.data[const.USER.KEY_USER_NAME] = user_name
        return self

    def get_result(self):
        return self.data
