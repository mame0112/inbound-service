import json
from google.cloud import datastore
import time

from server.const.const import HttpResponseCode, Conversation

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

# from server.datastore.data_processor.conversation_dataformat_processor import(
#     ConversationDataFormatProcessor)

from server.result.result import Result

from server.util.logger import Logger


class MessageDatastoreCommander(AbstractDatastoreCommander):

    log = Logger("MessageDatastoreCommander")

    def get(self):
        pass

    def post(self):
        pass

    def put(self, comment_data):
        result = Result()

        try:
            client = datastore.Client()
            conversation_id = comment_data[Conversation.KEY_CONVERSATION_ID]
            key = client.key(Conversation.KIND_NAME, conversation_id)
            entity = client.get(key)

            messages = entity[Conversation.KEY_MESSAGES]
            if messages is None:
                messages = []

            latest_message_in_client = comment_data[
                Conversation.KEY_MESSAGES_LATEST_TIMESTAMP]

            # Store data to datastore
            current_time = int(time.time())
            comment_data[Conversation.KEY_MESSAGES][
                Conversation.KEY_MESSAGES_TIMESTAMP] = current_time

            messages.append(json.dumps(
                comment_data[Conversation.KEY_MESSAGES]))
            entity[Conversation.KEY_MESSAGES] = messages

            client.put(entity)

            # Create output data
            output = []

            self.log.debug('latest_message_in_client')
            self.log.debug(latest_message_in_client)

            for msg in messages:
                msg_obj = json.loads(msg)
                timestamp = msg_obj[Conversation.KEY_MESSAGES_TIMESTAMP]
                if timestamp > latest_message_in_client:
                    # self.log.debug('Bigger than client')
                    output.append(json.loads(msg))
                # else:
                    # self.log.debug('Smaller than client')

            result.set_content(output)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def delete(self):
        pass
