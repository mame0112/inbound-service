from abc import ABC, abstractmethod

from google.cloud import datastore

from server.result.result import Result
from server.const.const import Consts, User, Visit, Conversation, State, HttpResponseCode


class AbstractDatastoreCommander(ABC):

    @abstractmethod
    def get(self):
        pass

    @abstractmethod
    def post(self):
        pass

    @abstractmethod
    def put(self):
        pass

    @abstractmethod
    def delete(self):
        pass

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

    def update_user_parameters(self, user_id, user_name, thumb_url, access_token, convs_as_host, convs_as_guest, user_properties, key_plans, psid):
        self.log.debug('update_user_parameters')
        # self.log.debug(user_id)
        # self.log.debug(psid)
        # self.log.debug(user_name)
        # self.log.debug(thumb_url)
        # self.log.debug(access_token)
        # self.log.debug(convs_as_host)
        # self.log.debug(convs_as_guest)
        # self.log.debug(user_properties)
        # self.log.debug(key_plans)

        if user_id is None or user_id is Consts.NO_USER:
            raise ValueError("User id cannot be null nor -1")

        result = Result()

        try:

            client = datastore.Client()
            key = client.key(User.KIND_NAME, user_id)
            entity = client.get(key)
            self.log.debug(entity)

            if user_id != Consts.NO_USER:
                entity[User.KEY_USER_ID] = user_id

            if user_name is not None:
                entity[User.KEY_USER_NAME] = user_name

            if thumb_url is not None:
                entity[User.KEY_THUMB_URL] = thumb_url

            if access_token is not None:
                entity[User.KEY_ACCESS_TOKEN] = access_token

            if convs_as_host is not None:
                json_host_array = entity[User.KEY_CONVERSATIONS_HOST]

                if len(json_host_array) == 1:
                    self.log.debug('length 1')
                    if Conversation.KEY_VISITOR_ID not in json_host_array[0]:
                        self.log.debug('Visitor does not exist')
                        # This is temporal id. Then remove it.
                        json_host_array.clear()

                json_host_array.append(convs_as_host)

                entity[User.KEY_CONVERSATIONS_HOST] = json_host_array

            if convs_as_guest is not None:
                self.log.debug(convs_as_guest)
                json_guest_array = entity[User.KEY_CONVERSATIONS_GUEST]

                # There are two patterns here.
                # 1st: Create visit (but no host has been found.)
                # 2nd: Update visit because host has newly found.

                if Conversation.KEY_CONVERSATION_ID in convs_as_guest:
                    # In case of 1st (Create new visit data)
                    for obj in json_guest_array:

                        try:
                            if obj[Conversation.KEY_VISIT_ID] == convs_as_guest[Conversation.KEY_VISIT_ID]:
                                self.log.debug('Visitor id matched')
                                obj[Conversation.KEY_HOST_ID] = convs_as_guest[
                                    Conversation.KEY_HOST_ID]
                                obj[Conversation.KEY_HOST_NAME] = convs_as_guest[
                                    Conversation.KEY_HOST_NAME]
                                obj[Conversation.KEY_HOST_THUMB_URL] = convs_as_guest[
                                    Conversation.KEY_HOST_THUMB_URL]
                                obj[Conversation.KEY_CONVERSATION_ID] = convs_as_guest[
                                    Conversation.KEY_CONVERSATION_ID]

                        except KeyError as error:
                            pass
                else:
                    # In case of 2nd (Create new if this vist deosn't exist)
                    new_obj = {}

                    new_obj[Visit.KEY_VISIT_ID] = convs_as_guest[
                        Visit.KEY_VISIT_ID]
                    new_obj[Visit.KEY_PLACE] = convs_as_guest[
                        Visit.KEY_PLACE]
                    new_obj[Visit.KEY_START] = convs_as_guest[
                        Visit.KEY_START]
                    new_obj[Visit.KEY_END] = convs_as_guest[Visit.KEY_END]

                    try:
                        # Catch JeyErrir because comment is optional field
                        new_obj[Visit.KEY_COMMENT] = convs_as_guest[
                            Visit.KEY_COMMENT]
                    except KeyError as error:
                        self.log.debug(error)

                    try:
                        new_obj[Visit.KEY_PROBLEMS] = convs_as_guest[
                            Visit.KEY_PROBLEMS]
                    except KeyError as error:
                        self.log.debug(error)

                    json_guest_array.append(new_obj)

                    # json_guest_array.append(convs_as_guest)

                entity[User.KEY_CONVERSATIONS_GUEST] = json_guest_array

            if user_properties is not None:
                entity[User.KEY_USER_PROPERTIES] = user_properties

            if key_plans is not None:
                entity[User.KEY_PLANS] = key_plans

            if psid is not None:
                entity[User.KEY_PSID] = psid

            client.put(entity)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(
                HttpResponseCode.INTERNAL_SERVER_ERROR)
            return None

        return self.create_updated_user_info(entity)

    def create_updated_user_info(self, entity):

        updated_user = {}

        try:
            if entity[User.KEY_USER_ID] is not None:
                updated_user[User.KEY_USER_ID] = entity[User.KEY_USER_ID]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_USER_NAME] is not None:
                updated_user[User.KEY_USER_NAME] = entity[User.KEY_USER_NAME]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_THUMB_URL] is not None:
                updated_user[User.KEY_THUMB_URL] = entity[User.KEY_THUMB_URL]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_CONVERSATIONS_HOST] is not None:
                updated_user[User.KEY_CONVERSATIONS_HOST] = entity[
                    User.KEY_CONVERSATIONS_HOST]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_CONVERSATIONS_GUEST] is not None:
                updated_user[User.KEY_CONVERSATIONS_GUEST] = entity[
                    User.KEY_CONVERSATIONS_GUEST]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_USER_PROPERTIES] is not None:
                updated_user[User.KEY_USER_PROPERTIES] = entity[
                    User.KEY_USER_PROPERTIES]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_PLANS] is not None:
                updated_user[User.KEY_PLANS] = entity[User.KEY_PLANS]
        except KeyError as error:
            self.log.debug(error)

        try:
            if entity[User.KEY_PSID] is not None:
                updated_user[User.KEY_PSID] = entity[User.KEY_PSID]
        except KeyError as error:
            self.log.debug(error)

        self.log.debug(updated_user)

        return updated_user
