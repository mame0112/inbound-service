import json

from server.const.const import User, Conversation, Host, Visit

from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.util.logger import Logger


class HostDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("HostDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entityToJson(self, entity):
        self.log.debug('entityToJson')
        data = {}
        data[Host.KEY_NAME] = entity[Host.KEY_NAME]
        data[Host.KEY_PLACE] = entity[Host.KEY_PLACE]
        data[Host.KEY_START] = entity[Host.KEY_START]
        data[Host.KEY_END] = entity[Host.KEY_END]
        data[Host.KEY_COMMENT] = entity[Host.KEY_COMMENT]
        data[Host.KEY_USER_ID] = entity[Host.KEY_USER_ID]
        data[Host.KEY_USER_NAME] = entity[Host.KEY_USER_NAME]
        data[Host.KEY_THUMB_URL] = entity[Host.KEY_THUMB_URL]

        self.log.debug(json.dumps(data))

        # json_data = json.dumps(data)

        return data

    def jsonToEntity(self, json):
        self.log.debug('jsonToEntity')
