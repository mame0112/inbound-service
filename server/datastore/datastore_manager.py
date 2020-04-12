import json
import threading
import time

from server.util.logger import Logger

from server.const.const import Consts, User, Conversation, Host, Visit, State, HttpResponseCode
from server.result.result import Result

from server.datastore.data_processor.user_dataformat_processor import UserDataFormatProcessor
from server.datastore.data_processor.host_dataformat_processor import HostDataFormatProcessor
from server.datastore.data_processor.visit_dataformat_processor import VisitDataFormatProcessor
from server.datastore.data_processor.conversation_dataformat_processor import ConversationDataFormatProcessor

from google.cloud import datastore

from server.facebook.token_retriver import TokenRetriever
from server.facebook.notification_sender import NotificationSender


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
        self.log.debug(type(user_id))

        if user_id is None or self.is_num(user_id) == False:
            self.log.debug('user is none or not string')
            result.set_error_message('user_id is none or not number')
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
            return result

        # user_id_int = int(user_id)

        try:
            client = datastore.Client()
            key = client.key(User.KIND_NAME, user_id)
            self.log.debug(key)
            entity = client.get(key)
            self.log.debug(entity)
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

            self.log.debug(userJson[User.KEY_USER_ID])
            key = client.key(User.KIND_NAME, userJson[User.KEY_USER_ID])

            # Check if this user already exists
            if client.get(key) is not None:
                self.log.debug('Content already exist')
            else:
                entity = datastore.Entity(key=key)
                entity[User.KEY_USER_ID] = userJson[User.KEY_USER_ID]
                entity[User.KEY_USER_NAME] = userJson[User.KEY_USER_NAME]
                entity[User.KEY_THUMB_URL] = userJson[User.KEY_THUMB_URL]

                retriver = TokenRetriever()
                token_response = retriver.exchange_token(
                    userJson[User.KEY_ACCESS_TOKEN])

                entity[User.KEY_ACCESS_TOKEN] = token_response[0]
                entity[User.KEY_ACCESS_TOKEN_EXPIRE_TIME] = token_response[1]

                sender = NotificationSender()
                sender.send_notification(
                    userJson[User.KEY_USER_ID], token_response[0])

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
        # self.log.debug(user_id)
        # self.log.debug(user_name)
        # self.log.debug(thumb_url)
        # self.log.debug(access_token)
        # self.log.debug(convs_host)
        # self.log.debug(convs_guest)
        # self.log.debug(user_properties)
        # self.log.debug(key_plans)

        if user_id is None:
            raise ValueError("User id cannot be null")

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
                jsonHostArray = entity[User.KEY_CONVERSATIONS_HOST]

                if len(jsonHostArray) == 1:
                    self.log.debug('length 1')
                    if 'visitor_id' not in jsonHostArray[0]:
                        self.log.debug('Visitor does not exist')
                        # This is temporal id. Then remove it.
                        jsonHostArray.clear()

                jsonHostArray.append(convs_host)

                entity[User.KEY_CONVERSATIONS_HOST] = jsonHostArray

            if convs_guest != None:
                jsonGuestArray = entity[User.KEY_CONVERSATIONS_GUEST]

                isExisting = False

                for obj in jsonGuestArray:

                    try:
                        # Update if already exist
                        if obj[Conversation.KEY_VISIT_ID] == convs_guest[Conversation.KEY_VISIT_ID]:
                            self.log.debug('Visitor id matched')
                            obj[Conversation.KEY_HOST_ID] = convs_guest[
                                Conversation.KEY_HOST_ID]
                            obj[Conversation.KEY_HOST_NAME] = convs_guest[
                                Conversation.KEY_HOST_NAME]
                            obj[Conversation.KEY_HOST_THUMB_URL] = convs_guest[
                                Conversation.KEY_HOST_THUMB_URL]
                            obj[Conversation.KEY_CONVERSATION_ID] = convs_guest[
                                Conversation.KEY_CONVERSATION_ID]

                            isExisting = True
                    except ValueError as error:
                        pass

                # Create new if this vist deosn't exist
                if isExisting == False:

                    newObj = {}

                    # TODO Need to update this part
                    # newObj[Visit.KEY_VISIT_ID] = convs_guest[
                    #     Visit.KEY_VISIT_ID]
                    # newObj[Visit.KEY_PLACE] = convs_guest[Visit.KEY_PLACE]
                    # newObj[Visit.KEY_START] = convs_guest[Visit.KEY_START]
                    # newObj[Visit.KEY_END] = convs_guest[Visit.KEY_END]
                    # # TODO Need to catch because comment is optional field
                    # newObj[Visit.KEY_COMMENT] = convs_guest[Visit.KEY_COMMENT]

                    # jsonGuestArray.append(newObj)

                # jsonGuestArray.append(convs_guest)
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

            # If more than 1 hosts are waiting
            if entities != None and len(entities) != 0:
                jsonarray = []

                processor = HostDataFormatProcessor()

                for entity in entities:
                    content = processor.entityToJson(entity)
                    jsonarray.append(content)

                result.set_content(jsonarray)

            else:
                # If no hosts are waiting
                result.set_content(None)

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
                self.log.debug('Target usr already exist')
                # TODO Need to consider return value (Because users have to
                # understand what happends)
                return result
            else:
                entity = datastore.Entity(key=key)
                processor = HostDataFormatProcessor()
                entity = processor.jsonToEntity(host_json, entity)

                client.put(entity)

                # Register host to state
                self.register_new_host_to_state(host_json[Host.KEY_USER_ID])

                # Update user data
                user_host = {}
                user_host[Host.KEY_USER_ID] = Consts.NO_USER

                # user_id, user_name, thumb_url, access_token,
                #                         convs_host, convs_guest, user_properties, key_plans
                self.update_user_parameters(host_json[Host.KEY_USER_ID], None, None, None,
                                            user_host, None, None, None)

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

        if visit_id is None or self.is_num(visit_id) == False:
            self.log.debug('visit_is is none or not number')
            result.set_error_message('visit_is is none or not number')
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
            return result

        visit_id_int = int(visit_id)

        client = datastore.Client()

        if visit_id_int == Consts.ALL_VISITS or visit_id_int == None:
            # Get latest 5 visits
            try:
                query = client.query(kind=Visit.KIND_NAME)
                entities = list(query.fetch())
                if entities != None and len(entities) != 0:
                    processor = VisitDataFormatProcessor()
                    visit_jsonobj = processor.entities_to_jsonarray(entities)
                    result.set_content(visit_jsonobj)
                else:
                    result.set_content(None)

                return result
            except ValueError as error:
                self.log.debug(error)
                result.set_error_message(error)
                result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
                return result

        else:
            # Get certain visit
            try:
                key = client.key(Visit.KIND_NAME, visit_id_int)
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
            entity[Visit.KEY_PROBLEMS] = visit_json[Visit.KEY_PROBLEMS]

            client.put(entity)

            # Update user data
            user_visit = {}
            user_visit[Visit.KEY_VISIT_ID] = ut
            user_visit[Visit.KEY_PLACE] = visit_json[Visit.KEY_PLACE]
            user_visit[Visit.KEY_START] = visit_json[Visit.KEY_START]
            user_visit[Visit.KEY_END] = visit_json[Visit.KEY_END]
            user_visit[Visit.KEY_COMMENT] = visit_json[Visit.KEY_COMMENT]
            user_visit[Visit.KEY_PROBLEMS] = visit_json[Visit.KEY_PROBLEMS]

            # Update User info
            self.update_user_parameters(visit_json[Visit.KEY_USER_ID], None, None, None,
                                        None, user_visit, None, None)

            # Update state
            self.register_waiting_visitor_to_state(ut)

            # Create result
            visit_id = {}
            visit_id[Visit.KEY_VISIT_ID] = ut

            result.set_content(visit_id)

            return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def get_conversation(self, conv_id):
        self.log.debug('get_conversation')

        result = Result()

        try:

            conv_id_int = int(conv_id)

            client = datastore.Client()
            key = client.key(Conversation.KIND_NAME, conv_id_int)
            entity = client.get(key)

            if entity is not None:
                processor = ConversationDataFormatProcessor()
                data = processor.entityToJson(entity)
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

    def update_conversation(self, conv_json):
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

    def create_conversation(self, conv_data):
        self.log.debug('create_conversation')
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
                                        convs_host, None, None, None)

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
                                        None, convs_guest, None, None)

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

    def update_comment(self, comment_data):
        self.log.debug('update_comment')
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

    def is_num(self, s):
        return s.replace(',', '').replace('.', '').replace('-', '').isnumeric()

    def register_new_host_to_state(self, host_id):
        self.log.debug('register_new_host_to_state')
        client = datastore.Client()
        key = client.key(State.KIND_NAME, State.KEY)
        entity = client.get(key)

        if entity is not None:
            array = entity[State.KEY_HOST_WAIT]
            array.append(host_id)
            entity[State.KEY_HOST_WAIT] = array
            client.put(entity)
        else:
            entity = datastore.Entity(key=key)
            array = []
            array.append(host_id)
            entity[State.KEY_HOST_WAIT] = array
            entity[State.KEY_VISIT_DONE] = []
            entity[State.KEY_VISIT_WAIT] = []

            client.put(entity)

    def register_waiting_visitor_to_state(self, visit_id):
        self.log.debug('register_waiting_visitor_to_state')
        client = datastore.Client()
        key = client.key(State.KIND_NAME, State.KEY)
        entity = client.get(key)

        if entity is not None:
            array = entity[State.KEY_VISIT_WAIT]
            array.append(visit_id)
            entity[State.KEY_VISIT_WAIT] = array
            client.put(entity)
        else:
            entity = datastore.Entity(key=key)
            entity[State.KEY_HOST_WAIT] = []
            entity[State.KEY_VISIT_DONE] = []
            array = []
            array.append(visit_id)
            entity[State.KEY_VISIT_WAIT] = array

            client.put(entity)

    def update_visitor_state(self, visit_id):
        # TODO
        self.log.debug('update_visitor_state')

        client = datastore.Client()
        key = client.key(State.KIND_NAME, State.KEY)
        entity = client.get(key)

        if entity is not None:
            # Remove from wait
            wait_array = entity[State.KEY_VISIT_WAIT]
            wait_array.remove(visit_id)
            entity[State.KEY_VISIT_WAIT] = wait_array

            # Add to done
            done_array = entity[State.KEY_VISIT_DONE]
            done_array.append(visit_id)
            entity[State.KEY_VISIT_DONE] = done_array

            client.put(entity)
        else:
            entity = datastore.Entity(key=key)
            entity[State.KEY_HOST_WAIT] = []
            entity[State.KEY_VISIT_DONE] = []
            array = []
            array.append(visit_id)
            entity[State.KEY_VISIT_WAIT] = array

            client.put(entity)
