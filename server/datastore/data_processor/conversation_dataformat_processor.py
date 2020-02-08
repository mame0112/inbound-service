import json

from server.const.const import Conversation

from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.util.logger import Logger


class ConversationDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("ConversationDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entityToJson(self, entity):
        self.log.debug('entityToJson')

        data = {}

        data[Conversation.KEY_HOST_ID] = entity[Conversation.KEY_HOST_ID]
        data[Conversation.KEY_HOST_NAME] = entity[Conversation.KEY_HOST_NAME]
        data[Conversation.KEY_HOST_THUMB_URL] = entity[
            Conversation.KEY_HOST_THUMB_URL]

        data[Conversation.KEY_VISITOR_ID] = entity[Conversation.KEY_VISITOR_ID]
        data[Conversation.KEY_VISITOR_NAME] = entity[
            Conversation.KEY_VISITOR_NAME]

        data[Conversation.KEY_VISITOR_THUMB_URL] = entity[
            Conversation.KEY_VISITOR_THUMB_URL]
        data[Conversation.KEY_MESSAGES] = entity[Conversation.KEY_MESSAGES]

        self.log.debug(json.dumps(data))

        return data

    def entities_to_jsonarray(self, entities):
        self.log.debug('entities_to_jsonarray')

    def jsonToEntity(self, conv_json, entity):
        self.log.debug('jsonToEntity')

        entity[Conversation.KEY_HOST_ID] = conv_json[Conversation.KEY_HOST_ID]
        entity[Conversation.KEY_HOST_NAME] = conv_json[
            Conversation.KEY_HOST_NAME]
        entity[Conversation.KEY_HOST_THUMB_URL] = conv_json[
            Conversation.KEY_HOST_THUMB_URL]
        entity[Conversation.KEY_VISITOR_ID] = conv_json[
            Conversation.KEY_VISITOR_ID]
        entity[Conversation.KEY_VISITOR_NAME] = conv_json[
            Conversation.KEY_VISITOR_NAME]
        entity[Conversation.KEY_VISITOR_THUMB_URL] = conv_json[
            Conversation.KEY_VISITOR_THUMB_URL]
        entity[Conversation.KEY_MESSAGES] = conv_json[
            Conversation.KEY_MESSAGES]

        return entity
