import json
from google.cloud import datastore
import time

from server.const.const import User, HttpResponseCode, Conversation

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

from server.datastore.data_processor.conversation_dataformat_processor import(
    ConversationDataFormatProcessor)

from server.facebook.message_content_generator import MessageContentGenerator
from server.facebook.fb_message_sender import FacebookMessageSender

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
        self.log.debug('post')
        self.log.debug(conv_data)
        result = Result()

        try:
            self.log.debug(conv_data)
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
            entity[Conversation.KEY_COMMENT] = conv_data[
                Conversation.KEY_COMMENT]
            entity[Conversation.KEY_PROBLEMS] = conv_data[
                Conversation.KEY_PROBLEMS]
            entity[Conversation.KEY_START] = conv_data[
                Conversation.KEY_START]
            entity[Conversation.KEY_END] = conv_data[
                Conversation.KEY_END]
            entity[Conversation.KEY_PLACE] = conv_data[
                Conversation.KEY_PLACE]

            # entity[Conversation.KEY_MESSAGES] = json.dumps(conv_json[
            #     Conversation.KEY_MESSAGES])
            # messages = []
            # messages.append(json.dumps(conv_data[Conversation.KEY_MESSAGES]))
            entity[Conversation.KEY_MESSAGES] = None

            entity[Conversation.KEY_CONVERSATION_ID] = ut

            client.put(entity)

            # Update user db (For Host)
            convs_as_host = {}
            convs_as_host[Conversation.KEY_VISITOR_ID] = conv_data[
                Conversation.KEY_VISITOR_ID]
            convs_as_host[Conversation.KEY_VISITOR_NAME] = conv_data[
                Conversation.KEY_VISITOR_NAME]
            convs_as_host[Conversation.KEY_VISITOR_THUMB_URL] = conv_data[
                Conversation.KEY_VISITOR_THUMB_URL]
            convs_as_host[Conversation.KEY_COMMENT] = conv_data[
                Conversation.KEY_COMMENT]
            convs_as_host[Conversation.KEY_PROBLEMS] = conv_data[
                Conversation.KEY_PROBLEMS]
            convs_as_host[Conversation.KEY_START] = conv_data[
                Conversation.KEY_START]
            convs_as_host[Conversation.KEY_END] = conv_data[
                Conversation.KEY_END]
            convs_as_host[Conversation.KEY_PLACE] = conv_data[
                Conversation.KEY_PLACE]

            convs_as_host[Conversation.KEY_CONVERSATION_ID] = ut

            host_user_id = conv_data[Conversation.KEY_HOST_ID]

            updated_host_user = self.update_user_parameters(host_user_id, None, None, None,
                                                            convs_as_host, None, None, None, None)

            # Update user db (For Guest)
            convs_as_guest = {}
            convs_as_guest[Conversation.KEY_HOST_ID] = conv_data[
                Conversation.KEY_HOST_ID]
            convs_as_guest[Conversation.KEY_HOST_NAME] = conv_data[
                Conversation.KEY_HOST_NAME]
            convs_as_guest[Conversation.KEY_HOST_THUMB_URL] = conv_data[
                Conversation.KEY_HOST_THUMB_URL]
            convs_as_guest[Conversation.KEY_CONVERSATION_ID] = ut
            convs_as_guest[Conversation.KEY_VISIT_ID] = conv_data[
                Conversation.KEY_VISIT_ID]
            self.log.debug(conv_data[Conversation.KEY_VISIT_ID])

            visitor_user_id = conv_data[Conversation.KEY_VISITOR_ID]

            updated_visitor_user = self.update_user_parameters(visitor_user_id, None, None, None,
                                                               None, convs_as_guest, None, None, None)

            self.log.debug(updated_host_user)
            self.log.debug(updated_visitor_user)

            msg_generator = MessageContentGenerator()

            sender = FacebookMessageSender()

            # Send Facebook message
            if conv_data[Conversation.KEY_CURRENT_USER_ID] == conv_data[
                    Conversation.KEY_HOST_ID]:
                # Current user is host. Then send Facebook Message to visitor
                self.log.debug('Current user is host')
                try:
                    sender.send(updated_visitor_user[
                        User.KEY_PSID], msg_generator.generate_matching_message_for_visitor(entity[Conversation.KEY_CONVERSATION_ID]))
                except KeyError as error:
                    # This error could happen because user might not select
                    # "Send to messenger" button
                    self.log.debug(error)
            else:
                self.log.debug('Current user is not host')

            if conv_data[Conversation.KEY_CURRENT_USER_ID] == conv_data[
                    Conversation.KEY_VISITOR_ID]:
                self.log.debug('Current user is visitor')
                try:
                    sender.send(updated_host_user[
                        User.KEY_PSID], msg_generator.generate_matching_message_for_host(entity[Conversation.KEY_CONVERSATION_ID]))
                except KeyError as error:
                    # This error could happen because user might not select
                    # "Send to messenger" button
                    self.log.debug(error)
            else:
                self.log.debug('Current user is not visitor')

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
        self.log.debug('Delete')

        result = Result()

        client = datastore.Client()
        query = client.query(kind=Conversation.KIND_NAME)
        all_keys = query.fetch()
        for key in all_keys:
            client.delete(key.key)

        return result
