# import json
import threading
# import time

from server.util.logger import Logger

# from server.const.const import Consts, User, Conversation, Host, Visit, State, HttpResponseCode
# from server.result.result import Result

from server.datastore.commander.user_database_commander import (
    UserDatastoreCommander)
from server.datastore.commander.visit_database_commander import VisitDatastoreCommander
from server.datastore.commander.host_database_commander import HostDatastoreCommander
from server.datastore.commander.conversation_database_commander import ConversationDatastoreCommander
from server.datastore.commander.message_database_commander import MessageDatastoreCommander


# from server.datastore.data_processor.user_dataformat_processor import UserDataFormatProcessor
# from server.datastore.data_processor.host_dataformat_processor import HostDataFormatProcessor
# from server.datastore.data_processor.visit_dataformat_processor import VisitDataFormatProcessor
# from server.datastore.data_processor.conversation_dataformat_processor import ConversationDataFormatProcessor

# from google.cloud import datastore


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

        user_db_commander = UserDatastoreCommander()
        return user_db_commander.get(user_id)

    def create_user(self, user_json):
        user_db_commander = UserDatastoreCommander()
        return user_db_commander.post(user_json)

    def update_user(self, user_json):
        user_db_commander = UserDatastoreCommander()
        return user_db_commander.put(user_json)

    def get_host(self):
        self.log.debug('get_host')
        host_db_commander = HostDatastoreCommander()
        return host_db_commander.get()

    def create_host(self, host_json):
        self.log.debug('create_host')
        host_db_commander = HostDatastoreCommander()
        return host_db_commander.post(host_json)

    def get_visit(self, visit_id):
        self.log.debug('get_visit')
        visit_db_commander = VisitDatastoreCommander()
        return visit_db_commander.get(visit_id)

    def create_visit(self, visit_json):
        self.log.debug('create_visit')
        visit_db_commander = VisitDatastoreCommander()
        return visit_db_commander.post(visit_json)

    def get_conversation(self, conv_id):
        self.log.debug('get_conversation')
        conversation_db_commander = ConversationDatastoreCommander()
        return conversation_db_commander.get(conv_id)

    def update_conversation(self, conv_json):
        self.log.debug('update_conversation')
        conversation_db_commander = ConversationDatastoreCommander()
        return conversation_db_commander.put(conv_json)

    def create_conversation(self, conv_data):
        self.log.debug('create_conversation')
        conversation_db_commander = ConversationDatastoreCommander()
        return conversation_db_commander.post(conv_data)

    def update_comment(self, comment_data):
        self.log.debug('update_comment')
        message_db_commander = MessageDatastoreCommander()
        return message_db_commander.put(comment_data)
