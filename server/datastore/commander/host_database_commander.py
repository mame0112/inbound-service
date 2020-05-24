from google.cloud import datastore

from server.const.const import Consts, HttpResponseCode, Host

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

from server.datastore.data_processor.host_dataformat_processor import(
    HostDataFormatProcessor)

from server.result.result import Result

from server.util.logger import Logger


class HostDatastoreCommander(AbstractDatastoreCommander):

    log = Logger("HostDatastoreCommander")

    def get(self):
        result = Result()

        try:

            waiting_hosts = self.get_wwaiting_hosts()

            if waiting_hosts is not None and len(waiting_hosts) > 0:
                target_host = waiting_hosts[0]

                client = datastore.Client()
                key = client.key(Host.KIND_NAME, target_host)
                entity = client.get(key)

                processor = HostDataFormatProcessor()
                content = processor.entity_to_json(entity)

                jsonarray = []
                jsonarray.append(content)

                result.set_content(jsonarray)

                return result
            else:
                result.set_content(None)

            return result

            # query = client.query(kind=Host.KIND_NAME)
            # entities = list(query.fetch())

            # # If more than 1 hosts are waiting
            # if entities is not None and len(entities) != 0:
            #     jsonarray = []

            #     processor = HostDataFormatProcessor()

            #     for entity in entities:
            #         content = processor.entity_to_json(entity)
            #         jsonarray.append(content)

            #     result.set_content(jsonarray)

            # else:
            #     # If no hosts are waiting
            #     result.set_content(None)

            # return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def post(self, host_json):
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
                entity = processor.json_to_entity(host_json, entity)

                client.put(entity)

                # Register host to state
                self.register_new_host_to_state(host_json[Host.KEY_USER_ID])

                # Update user data
                user_host = {}
                user_host[Host.KEY_USER_ID] = Consts.NO_USER

                # user_id, user_name, thumb_url, access_token,
                #                         convs_host, convs_guest, user_properties, key_plans
                self.update_user_parameters(host_json[Host.KEY_USER_ID], None, None, None,
                                            user_host, None, None, None, None)

                return result

        except ValueError as error:
            self.log.debug(error)
            result.set_error_message(error)
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)

        return result

    def put(self):
        pass

    def delete(self):
        self.log.debug('Delete')

        result = Result()

        client = datastore.Client()
        query = client.query(kind=Host.KIND_NAME)
        all_keys = query.fetch()
        for key in all_keys:
            client.delete(key.key)

        return result
