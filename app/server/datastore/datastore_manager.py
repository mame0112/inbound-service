import json
import threading

from server.util.logger import Logger

from server.const.const import User, Conversation, Host, Visit, HttpResponseCode
from server.result.result import Result

from google.cloud import datastore


class DatastoreManager:

    log = Logger("DatastoreManager")

    result = Result()

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

        if user_id == Consts.NO_USER:
            raise ValueError('User ID cannot be -1')

        try:
            client = datastore.Client()
            key = client.key(USER.KEY_USER_ID, user_id)
            entity = client.get(key)

            userJson = {
                User.KEY_USER_ID: entity[User.KEY_USER_NAME],
                User.KEY_USER_NAME: entity[User.KEY_USER_NAME],
                User.KEY_THUMB_URL: entity[User.KEY_THUMB_URL],
            }

            return self.result, userJson

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
        return self.result

    def create_user(self, userJson):
        self.log.debug('create_user')

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

                client.put(entity)

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return self.result

    def update_user(self, userJson):
        self.log.debug('update_user')

        client = datastore.Client()
        key = client.key(USER.KEY_USER_ID, user_id)
        entity = client.get(key)

        if userJson[User.KEY_USER_NAME] != None:
            entity[User.KEY_USER_NAME] = userJson[User.KEY_USER_NAME]

        if userJson[User.KEY_THUMB_URL] != None:
            entity[User.KEY_THUMB_URL] = userJson[User.KEY_THUMB_URL]

        if userJson[User.KEY_THUMB_URL] != None:
            entity[User.KEY_THUMB_URL] = userJson[User.KEY_THUMB_URL]

        if userJson[User.KEY_ACCESS_TOKEN] != None:
            entity[User.KEY_ACCESS_TOKEN] = userJson[User.KEY_ACCESS_TOKEN]

        if userJson[User.KEY_CONVERSATIONS] != None:
            entity[User.KEY_CONVERSATIONS] = userJson[User.KEY_CONVERSATIONS]

        if userJson[User.KEY_PLANS] != None:
            entity[User.KEY_PLANS] = userJson[User.KEY_PLANS]

        client.put(entity)

        return self.result

    def get_host(self):
        self.log.debug('get_host')
        return

    def create_host(self):
        self.log.debug('create_host')
        return

    def get_visit(self):
        self.log.debug('get_visit')
        return

    def create_visit(self):
        self.log.debug('create_visit')
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
