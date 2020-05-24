from google.cloud import datastore

from server.const.const import State

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

from server.result.result import Result

from server.util.logger import Logger


class StateDatastoreCommander(AbstractDatastoreCommander):

    log = Logger("StateDatastoreCommander")

    def get(self):
        pass

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        self.log.debug('Delete')

        result = Result()

        client = datastore.Client()
        query = client.query(kind=State.KIND_NAME)
        all_keys = query.fetch()
        for key in all_keys:
            client.delete(key.key)

        return result
