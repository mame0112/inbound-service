import json
import threading
import time

from server.util.logger import Logger

from server.const.const import Consts, User, Conversation, Host, Visit, HttpResponseCode
from server.result.result import Result

from server.datastore.data_processor.user_dataformat_processor import UserDataFormatProcessor
from server.datastore.data_processor.host_dataformat_processor import HostDataFormatProcessor
from server.datastore.data_processor.visit_dataformat_processor import VisitDataFormatProcessor

from google.cloud import datastore


class DatastoreManager:

    log = Logger("DatastoreManager")

    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.log.debug('Initialize')

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
            return cls._instance

    # USser
    def get_user(self, user_id):
        self.log.debug('get_user')
        result = Result()

        if user_id == Consts.NO_USER:
            raise ValueError('User ID cannot be -1')

        try:
            client = datastore.Client()
            key = client.key(User.KIND_NAME, user_id)
            entity = client.get(key)
            if entity is not None:

                processor = UserDataFormatProcessor()
                userJson = processor.entityToJson(entity)

                self.log.debug(userJson)

                result.set_content(userJson)

                return result
            else:
                self.log.debug("No entity found")
                return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
        return result

    def create_user(self, userJson):
        self.log.debug('create_user')
        result = Result()

        try:
            client = datastore.Client()

            key = client.key(User.KIND_NAME, userJson[User.KEY_USER_ID])

            # Check if this user already exists
            if client.get(key) is not None:
                self.log.debug('Content already exist')
            else:
                entity = datastore.Entity(key=key)
                entity[User.KEY_USER_ID] = userJson[User.KEY_USER_ID]
                entity[User.KEY_USER_NAME] = userJson[User.KEY_USER_NAME]
                entity[User.KEY_THUMB_URL] = userJson[User.KEY_THUMB_URL]
                entity[User.KEY_ACCESS_TOKEN] = userJson[User.KEY_ACCESS_TOKEN]
                # Create empty Json array
                entity[User.KEY_CONVERSATIONS_HOST] = []
                entity[User.KEY_CONVERSATIONS_GUEST] = []

                client.put(entity)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def update_user(self, userJson):
        self.log.debug('update_user')

        user_id = Consts.NO_USER
        user_name = None
        thumb_url = None
        access_token = None
        convs_host = None
        convs_guest = None
        user_properties = None
        key_plans = None

        # Mandatory
        try:
            if userJson[User.KEY_USER_ID] != None:
                user_id = userJson[User.KEY_USER_ID]
        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(
                HttpResponseCode.BAD_REQUEST)

        try:
            if User.KEY_USER_NAME in userJson == True and userJson[User.KEY_USER_NAME] != None:
                user_name = userJson[User.KEY_USER_NAME]
        except ValueError as error:
            pass

        try:
            if User.KEY_THUMB_URL in userJson == True and userJson[User.KEY_THUMB_URL] != None:
                thumb_url = userJson[User.KEY_THUMB_URL]
        except ValueError as error:
            pass

        try:
            if User.KEY_ACCESS_TOKEN in userJson == True and userJson[User.KEY_ACCESS_TOKEN] != None:
                access_token = userJson[User.KEY_ACCESS_TOKEN]
        except ValueError as error:
            pass

        try:
            if User.KEY_CONVERSATIONS_HOST in userJson == True and userJson[User.KEY_CONVERSATIONS_HOST] != None:
                convs_host = userJson[User.KEY_CONVERSATIONS_HOST]
        except ValueError as error:
            pass

        try:
            if User.KEY_CONVERSATIONS_GUEST in userJson == True and userJson[User.KEY_CONVERSATIONS_GUEST] != None:
                convs_guest = userJson[User.KEY_CONVERSATIONS_GUEST]
        except ValueError as error:
            pass

        try:
            if User.KEY_USER_PROPERTIES in userJson == True and userJson[User.KEY_USER_PROPERTIES] != None:
                user_properties = userJson[User.KEY_USER_PROPERTIES]
        except ValueError as error:
            pass

        try:
            if User.KEY_PLANS in userJson == True and userJson[User.KEY_PLANS] != None:
                key_plans = userJson[User.KEY_PLANS]
        except ValueError as error:
            pass

        self.update_user_parameters(user_id, user_name, thumb_url, access_token,
                                    convs_host, convs_guest, user_properties, key_plans)

    def update_user_parameters(self, user_id, user_name, thumb_url, access_token, convs_host, convs_guest, user_properties, key_plans):
        self.log.debug('update_user isolate')
        self.log.debug(user_id)
        self.log.debug(user_name)
        self.log.debug(thumb_url)
        self.log.debug(access_token)
        self.log.debug(convs_host)
        self.log.debug(convs_guest)
        self.log.debug(user_properties)
        self.log.debug(key_plans)

        result = Result()

        try:

            client = datastore.Client()
            key = client.key(User.KIND_NAME, user_id)
            entity = client.get(key)

            if user_id != Consts.NO_USER:
                entity[User.KEY_USER_ID] = user_id

            if user_name != None:
                entity[User.KEY_USER_NAME] = user_name

            if thumb_url != None:
                entity[User.KEY_THUMB_URL] = thumb_url

            if access_token != None:
                entity[User.KEY_ACCESS_TOKEN] = access_token

            if convs_host != None:
                jsonHostArray = entity[
                    User.KEY_CONVERSATIONS_HOST]
                jsonHostArray.append(convs_host)
                entity[User.KEY_CONVERSATIONS_HOST] = jsonArray

            if convs_guest != None:
                jsonGuestArray = entity[User.KEY_CONVERSATIONS_GUEST]
                jsonGuestArray.append(convs_guest)
                entity[User.KEY_CONVERSATIONS_GUEST] = jsonGuestArray

            if user_properties != None:
                entity[User.KEY_USER_PROPERTIES] = user_properties

            if key_plans != None:
                entity[User.KEY_PLANS] = key_plans

            client.put(entity)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(
                HttpResponseCode.INTERNAL_SERVER_ERROR)
            return result

        return result

    def get_host(self):
        self.log.debug('get_host')
        result = Result()

        try:
            client = datastore.Client()
            query = client.query(kind=Host.KIND_NAME)
            entities = list(query.fetch())

            jsonarray = []

            processor = HostDataFormatProcessor()

            for entity in entities:
                content = processor.entityToJson(entity)
                jsonarray.append(content)

                result.set_content(jsonarray)

            return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def create_host(self, host_json):
        self.log.debug('create_host')
        self.log.debug(host_json)

        result = Result()

        try:
            client = datastore.Client()

            key = client.key(Host.KIND_NAME, host_json[Host.KEY_USER_ID])

            # Check if this user already exists
            if client.get(key) is not None:
                self.log.debug('Content already exist')
                # TODO Need to consider return value
                return result
            else:
                entity = datastore.Entity(key=key)
                processor = HostDataFormatProcessor()
                entity = processor.jsonToEntity(host_json, entity)

                client.put(entity)

                return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def get_visit(self, visit_id):
        self.log.debug('get_visit')
        self.log.debug(visit_id)
        result = Result()

        client = datastore.Client()

        if visit_id == Consts.ALL_VISITS or visit_id == None:
            # Get latest 5 visits
            try:
                query = client.query(kind=Visit.KIND_NAME)
                entities = list(query.fetch())
                processor = VisitDataFormatProcessor()
                visit_jsonobj = processor.entities_to_jsonarray(entities)

                result.set_content(visit_jsonobj)

                return result
            except ValueError as error:
                self.log.debug(error)
                result.set_error_message(error)
                result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
                return result

        else:
            # Get certain visit
            try:
                key = client.key(Visit.KIND_NAME, visit_id)
                entity = client.get(key)
                if entity != None:
                    self.log.debug('entity is not none')
                    processor = VisitDataFormatProcessor()
                    visit_json = processor.entityToJson(entity)

                    self.log.debug(visit_json)

                    result.set_content(visit_json)

                    # self.log.debug(json.dumps(visit_json))
                    return result
                else:
                    self.log.debug('entity is none')
                    return result

            except ValueError as error:
                self.log.debug(error)
                result.set_error_message(error)
                result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
                return result
        return result

    def create_visit(self, visit_json):
        self.log.debug('create_visit')
        result = Result()

        try:
            # Create Visit data
            ut = int(time.time())

            client = datastore.Client()
            key = client.key(Visit.KIND_NAME, ut)

            entity = datastore.Entity(key=key)
            # entity[Visit.KEY_VISIT_ID] = visit_json[Visit.KEY_VISIT_ID]
            entity[Visit.KEY_VISIT_ID] = ut
            entity[Visit.KEY_USER_ID] = visit_json[Visit.KEY_USER_ID]
            entity[Visit.KEY_USER_NAME] = visit_json[Visit.KEY_USER_NAME]
            entity[Visit.KEY_THUMB_URL] = visit_json[Visit.KEY_THUMB_URL]
            entity[Visit.KEY_PLACE] = visit_json[Visit.KEY_PLACE]
            entity[Visit.KEY_START] = visit_json[Visit.KEY_START]
            entity[Visit.KEY_END] = visit_json[Visit.KEY_END]
            entity[Visit.KEY_COMMENT] = visit_json[Visit.KEY_COMMENT]

            client.put(entity)

            # Update User info
            self.update_user_parameters(visit_json[Visit.KEY_USER_ID], None, None, None,
                                        None, ut, None, None)

            return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def generate_visit_id(self):
        # TODO Implement visi id generation
        self.log.debug('generate_visit_id')
        return

    def get_conversation(self, conv_id):
        self.log.debug('get_conversation')

        client = datastore.Client()
        key = client.key(Conversation.Conversation, conv_id)
        entity = client.get(key)
        return

    def update_conversation(self):
        self.log.debug('update_conversation')
        return

    def create_conversation(self):
        self.log.debug('create_conversation')
        return
