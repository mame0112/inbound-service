import json

from server.const.const import Conversation

from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.util.logger import Logger


class ConversationDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("ConversationDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entity_to_json(self, entity):
        self.log.debug('entity_to_json')

        data = {}

        data[Conversation.KEY_CONVERSATION_ID] = entity[
            Conversation.KEY_CONVERSATION_ID]
        data[Conversation.KEY_HOST_ID] = entity[Conversation.KEY_HOST_ID]
        data[Conversation.KEY_HOST_NAME] = entity[Conversation.KEY_HOST_NAME]
        data[Conversation.KEY_HOST_THUMB_URL] = entity[
            Conversation.KEY_HOST_THUMB_URL]

        data[Conversation.KEY_VISITOR_ID] = entity[Conversation.KEY_VISITOR_ID]
        data[Conversation.KEY_VISITOR_NAME] = entity[
            Conversation.KEY_VISITOR_NAME]

        data[Conversation.KEY_VISITOR_THUMB_URL] = entity[
            Conversation.KEY_VISITOR_THUMB_URL]

        messages = entity[Conversation.KEY_MESSAGES]
        output = []
        if messages is None:
            messages = []

        for msg in messages:
            output.append(json.loads(msg))

        data[Conversation.KEY_MESSAGES] = output

        if Conversation.KEY_COMMENT in entity:
            data[Conversation.KEY_COMMENT] = entity[
                Conversation.KEY_COMMENT]

        if Conversation.KEY_PROBLEMS in entity:
            data[Conversation.KEY_PROBLEMS] = entity[
                Conversation.KEY_PROBLEMS]

        data[Conversation.KEY_START] = entity[
            Conversation.KEY_START]
        data[Conversation.KEY_END] = entity[
            Conversation.KEY_END]
        data[Conversation.KEY_PLACE] = entity[
            Conversation.KEY_PLACE]

        self.log.debug(json.dumps(data))

        return data

    def entities_to_jsonarray(self, entities):
        self.log.debug('entities_to_jsonarray')

    def json_to_entity(self, conv_json, entity):
        self.log.debug('json_to_entity')

        try:
            entity[Conversation.KEY_CONVERSATION_ID] = conv_json[
                Conversation.KEY_CONVERSATION_ID]
        except KeyError as error:
            self.log.debug(error)
            pass

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
        entity[Conversation.KEY_MESSAGES] = json.dumps(conv_json[
            Conversation.KEY_MESSAGES])
        entity[Conversation.KEY_COMMENT] = json.dumps(conv_json[
            Conversation.KEY_COMMENT])
        entity[Conversation.KEY_PROBLEMS] = json.dumps(conv_json[
            Conversation.KEY_PROBLEMS])
        entity[Conversation.KEY_START] = json.dumps(conv_json[
            Conversation.KEY_START])
        entity[Conversation.KEY_END] = json.dumps(conv_json[
            Conversation.KEY_END])
        entity[Conversation.KEY_PLACE] = json.dumps(conv_json[
            Conversation.KEY_PLACE])

        self.log.debug(json.dumps(conv_json[Conversation.KEY_MESSAGES]))

        return entity

    def update_entity(self, original_entity, update_json):
        self.log.debug('updateEntity')

        original_entity[Conversation.KEY_HOST_ID] = update_json[
            Conversation.KEY_HOST_ID]
        original_entity[Conversation.KEY_HOST_NAME] = update_json[
            Conversation.KEY_HOST_NAME]
        original_entity[Conversation.KEY_HOST_THUMB_URL] = update_json[
            Conversation.KEY_HOST_THUMB_URL]
        original_entity[Conversation.KEY_VISITOR_ID] = update_json[
            Conversation.KEY_VISITOR_ID]
        original_entity[Conversation.KEY_VISITOR_NAME] = update_json[
            Conversation.KEY_VISITOR_NAME]
        original_entity[Conversation.KEY_VISITOR_THUMB_URL] = update_json[
            Conversation.KEY_VISITOR_THUMB_URL]

        original_entity[Conversation.KEY_COMMENT] = update_json[
            Conversation.KEY_COMMENT]
        original_entity[Conversation.KEY_PROBLEMS] = update_json[
            Conversation.KEY_PROBLEMS]
        original_entity[Conversation.KEY_START] = update_json[
            Conversation.KEY_START]
        original_entity[Conversation.KEY_END] = update_json[
            Conversation.KEY_END]
        original_entity[Conversation.KEY_PLACE] = update_json[
            Conversation.KEY_PLACE]

        messages = json.loads(original_entity[Conversation.KEY_MESSAGES])

        messages.append(update_json[Conversation.KEY_MESSAGES])
        original_entity[Conversation.KEY_MESSAGES] = json.dumps(messages)
        return original_entity
