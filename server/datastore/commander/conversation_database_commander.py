import json
from google.cloud import datastore
import time

from server.const.const import HttpResponseCode, Conversation

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

from server.datastore.data_processor.conversation_dataformat_processor import(
    ConversationDataFormatProcessor)

from server.result.result import Result

from server.util.logger import Logger


class ConversationDatastoreCommander(AbstractDatastoreCommander):

    log = Logger("ConversationDatastoreCommander")

    def get(self, conv_id):
        result = Result()

        try:

            conv_id_int = int(conv_id)

            client = datastore.Client()
            key = client.key(Conversation.KIND_NAME, conv_id_int)
            entity = client.get(key)

            if entity is not None:
                processor = ConversationDataFormatProcessor()
                data = processor.entity_to_json(entity)
                result.set_content(data)
            else:
                self.log.debug('Entity is None')
                result.set_error_message('Entity is None')
                result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def post(self, conv_data):
        result = Result()

        try:
            ut = int(time.time())

            client = datastore.Client()

            # Store conversation data to conversation kind
            key = client.key(Conversation.KIND_NAME, ut)

            entity = datastore.Entity(key=key)
            # processor = ConversationDataFormatProcessor()
            # processor.jsonToEntity(conv_data, entity)

            entity[Conversation.KEY_HOST_ID] = conv_data[
                Conversation.KEY_HOST_ID]
            entity[Conversation.KEY_HOST_NAME] = conv_data[
                Conversation.KEY_HOST_NAME]
            entity[Conversation.KEY_HOST_THUMB_URL] = conv_data[
                Conversation.KEY_HOST_THUMB_URL]
            entity[Conversation.KEY_VISITOR_ID] = conv_data[
                Conversation.KEY_VISITOR_ID]
            entity[Conversation.KEY_VISITOR_NAME] = conv_data[
                Conversation.KEY_VISITOR_NAME]
            entity[Conversation.KEY_VISITOR_THUMB_URL] = conv_data[
                Conversation.KEY_VISITOR_THUMB_URL]
            entity[Conversation.KEY_VISIT_ID] = conv_data[
                Conversation.KEY_VISIT_ID]
            # entity[Conversation.KEY_MESSAGES] = json.dumps(conv_json[
            #     Conversation.KEY_MESSAGES])
            # messages = []
            # messages.append(json.dumps(conv_data[Conversation.KEY_MESSAGES]))
            entity[Conversation.KEY_MESSAGES] = None

            entity[Conversation.KEY_CONVERSATION_ID] = ut

            client.put(entity)

            # Update user db (For Host)
            # TODO Need to add plan info
            convs_host = {}
            convs_host[Conversation.KEY_VISITOR_ID] = conv_data[
                Conversation.KEY_VISITOR_ID]
            convs_host[Conversation.KEY_VISITOR_NAME] = conv_data[
                Conversation.KEY_VISITOR_NAME]
            convs_host[Conversation.KEY_VISITOR_THUMB_URL] = conv_data[
                Conversation.KEY_VISITOR_THUMB_URL]
            convs_host[Conversation.KEY_CONVERSATION_ID] = ut

            host_user_id = conv_data[Conversation.KEY_HOST_ID]

            # user_id, user_name, thumb_url, access_token, convs_host, convs_guest, user_properties, key_plans
            self.update_user_parameters(host_user_id, None, None, None,
                                        convs_host, None, None, None, None)

            # Update user db (For Guest)
            convs_guest = {}
            convs_guest[Conversation.KEY_HOST_ID] = conv_data[
                Conversation.KEY_HOST_ID]
            convs_guest[Conversation.KEY_HOST_NAME] = conv_data[
                Conversation.KEY_HOST_NAME]
            convs_guest[Conversation.KEY_HOST_THUMB_URL] = conv_data[
                Conversation.KEY_HOST_THUMB_URL]
            convs_guest[Conversation.KEY_CONVERSATION_ID] = ut
            convs_guest[Conversation.KEY_VISIT_ID] = conv_data[
                Conversation.KEY_VISIT_ID]
            self.log.debug(conv_data[Conversation.KEY_VISIT_ID])

            visitor_user_id = conv_data[Conversation.KEY_VISITOR_ID]

            self.update_user_parameters(visitor_user_id, None, None, None,
                                        None, convs_guest, None, None, None)

            # Create result
            conv_id = {}
            conv_id[Conversation.KEY_CONVERSATION_ID] = ut

            result.set_content(conv_id)

            self.log.debug(conv_id)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def put(self, conv_json):
        self.log.debug('update_conversation')

        result = Result()

        try:
            client = datastore.Client()

            conversation_id = conv_json[Conversation.KEY_CONVERSATION_ID]
            key = client.key(Conversation.KIND_NAME, conversation_id)
            entity = client.get(key)

            # processor = ConversationDataFormatProcessor()
            # entity = processor.update_entity(entity, conv_json)
            entity[Conversation.KEY_HOST_ID] = conv_json[
                Conversation.KEY_HOST_ID]
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

            messages = entity[Conversation.KEY_MESSAGES]
            # json.loads(

            messages.append(json.dumps(conv_json[Conversation.KEY_MESSAGES]))
            entity[Conversation.KEY_MESSAGES] = messages

            client.put(entity)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def delete(self):
        pass
