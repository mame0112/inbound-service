from google.cloud import datastore

from server.const.const import Consts, HttpResponseCode, User

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

from server.datastore.data_processor.user_dataformat_processor import(
    UserDataFormatProcessor)

from server.facebook.notification_sender import NotificationSender
from server.facebook.token_retriver import TokenRetriever

from server.result.result import Result

from server.util.logger import Logger


class UserDatastoreCommander(AbstractDatastoreCommander):

    log = Logger("UserDatastoreCommander")

    def get(self, user_id):
        self.log.debug('get_user')
        result = Result()
        self.log.debug(type(user_id))

        if user_id is None or self.is_num(user_id) is not False:
            self.log.debug('user is none or not string')
            result.set_error_message('user_id is none or not number')
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
            return result

        try:
            client = datastore.Client()
            key = client.key(User.KIND_NAME, user_id)
            self.log.debug(key)
            entity = client.get(key)
            self.log.debug(entity)
            if entity is not None:

                processor = UserDataFormatProcessor()
                user_json = processor.entityToJson(entity)

                self.log.debug(user_json)

                result.set_content(user_json)

                return result
            else:
                self.log.debug("No entity found")
                return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
        return result

    def post(self, user_json):
        self.log.debug('create_user')
        result = Result()

        try:
            client = datastore.Client()

            self.log.debug(user_json[User.KEY_USER_ID])
            key = client.key(User.KIND_NAME, user_json[User.KEY_USER_ID])

            # Check if this user already exists
            if client.get(key) is not None:
                self.log.debug('Content already exist')
            else:
                entity = datastore.Entity(key=key)
                entity[User.KEY_USER_ID] = user_json[User.KEY_USER_ID]
                entity[User.KEY_USER_NAME] = user_json[User.KEY_USER_NAME]
                entity[User.KEY_THUMB_URL] = user_json[User.KEY_THUMB_URL]

                retriver = TokenRetriever()
                token_response = retriver.exchange_token(
                    user_json[User.KEY_ACCESS_TOKEN])

                entity[User.KEY_ACCESS_TOKEN] = token_response[0]
                entity[User.KEY_ACCESS_TOKEN_EXPIRE_TIME] = token_response[1]

                sender = NotificationSender()
                sender.send_notification(
                    user_json[User.KEY_USER_ID], token_response[0])

                # Create empty Json array
                entity[User.KEY_CONVERSATIONS_HOST] = []
                entity[User.KEY_CONVERSATIONS_GUEST] = []

                client.put(entity)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def put(self, user_json):
        self.log.debug('update_user')

        user_id = Consts.NO_USER
        user_name = None
        thumb_url = None
        access_token = None
        convs_host = None
        convs_guest = None
        user_properties = None
        key_plans = None

        result = Result()

        # Mandatory
        try:

            if user_json[User.KEY_USER_ID] is not None:

                user_id = user_json[User.KEY_USER_ID]
        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(
                HttpResponseCode.BAD_REQUEST)

        try:

            if User.KEY_USER_NAME in user_json and user_json[User.KEY_USER_NAME] is not None:

                user_name = user_json[User.KEY_USER_NAME]
        except ValueError as error:
            pass

        try:

            if User.KEY_THUMB_URL in user_json and user_json[User.KEY_THUMB_URL] is not None:

                thumb_url = user_json[User.KEY_THUMB_URL]
        except ValueError as error:
            pass

        try:

            if User.KEY_ACCESS_TOKEN in user_json and user_json[User.KEY_ACCESS_TOKEN] is not None:
                access_token = user_json[User.KEY_ACCESS_TOKEN]
        except ValueError as error:
            pass

        try:

            if User.KEY_CONVERSATIONS_HOST in user_json and user_json[User.KEY_CONVERSATIONS_HOST] is not None:
                convs_host = user_json[User.KEY_CONVERSATIONS_HOST]
        except ValueError as error:
            pass

        try:
            if User.KEY_CONVERSATIONS_GUEST in user_json and user_json[User.KEY_CONVERSATIONS_GUEST] is not None:
                convs_guest = user_json[User.KEY_CONVERSATIONS_GUEST]
        except ValueError as error:
            pass

        try:
            if User.KEY_USER_PROPERTIES in user_json and user_json[User.KEY_USER_PROPERTIES] is not None:
                user_properties = user_json[User.KEY_USER_PROPERTIES]
        except ValueError as error:
            pass

        try:
            if User.KEY_PLANS in user_json and user_json[User.KEY_PLANS] is not None:
                key_plans = user_json[User.KEY_PLANS]
        except ValueError as error:
            pass

        self.update_user_parameters(user_id, user_name, thumb_url, access_token,
                                    convs_host, convs_guest, user_properties, key_plans)

    def delete(self):
        pass
