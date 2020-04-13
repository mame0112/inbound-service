from google.cloud import datastore
import time

from server.const.const import Consts, HttpResponseCode, Visit

from server.datastore.commander.adb_database_commander import (
    AbstractDatastoreCommander)

from server.datastore.data_processor.visit_dataformat_processor import(
    VisitDataFormatProcessor)

from server.result.result import Result

from server.util.logger import Logger


class VisitDatastoreCommander(AbstractDatastoreCommander):

    log = Logger("VisitDatastoreCommander")

    def get(self, visit_id):
        self.log.debug(visit_id)

        result = Result()

        if visit_id is None or self.is_num(visit_id) is False:
            self.log.debug('visit_is is none or not number')
            result.set_error_message('visit_is is none or not number')
            result.set_http_response_code(HttpResponseCode.BAD_REQUEST)
            return result

        visit_id_int = int(visit_id)

        client = datastore.Client()

        if visit_id_int == Consts.ALL_VISITS or visit_id_int is None:
            # Get latest 5 visits
            try:
                query = client.query(kind=Visit.KIND_NAME)
                entities = list(query.fetch())
                if entities is not None and len(entities) != 0:
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
                if entity is not None:
                    self.log.debug('entity is not none')
                    processor = VisitDataFormatProcessor()
                    visit_json = processor.entity_to_json(entity)

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

    def post(self, visit_json):
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

    def put(self):
        pass

    def delete(self):
        pass
