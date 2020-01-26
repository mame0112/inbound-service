import json

from server.util.logger import Logger
from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.const.const import User, Conversation, Host, Visit


class UserDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("UserDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entityToJson(self, entity):
        self.log.debug('entityToJson')

        data = {}

        # Mandatory fields
        data[User.KEY_USER_ID] = entity[User.KEY_USER_ID]
        data[User.KEY_USER_NAME] = entity[User.KEY_USER_NAME]
        data[User.KEY_THUMB_URL] = entity[User.KEY_THUMB_URL]
        data[User.KEY_ACCESS_TOKEN] = entity[User.KEY_ACCESS_TOKEN]

        # Optional fields
        try:
            data[User.KEY_CONVERSATIONS] = entity[User.KEY_CONVERSATIONS]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_USER_PROPERTIES] = entity[User.KEY_USER_PROPERTIES]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_PLANS] = entity[User.KEY_PLANS]
        except ValueError as error:
            # Nothing to do
            pass

        self.log.debug(json.dumps(data))

        return data

    def jsonToEntity(self, host_json, entity):
        self.log.debug('jsonToEntity')

        entity[Host.KEY_USER_ID] = host_json[Host.KEY_USER_ID]
        entity[Host.KEY_USER_NAME] = host_json[Host.KEY_USER_NAME]
        entity[Host.KEY_THUMB_URL] = host_json[Host.KEY_THUMB_URL]

        return entity
