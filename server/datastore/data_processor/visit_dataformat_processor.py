import json

from server.const.const import Visit

from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.util.logger import Logger


class VisitDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("VisitDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entity_to_json(self, entity):
        self.log.debug('entity_to_json')

        data = {}
        data[Visit.KEY_VISIT_ID] = entity[Visit.KEY_VISIT_ID]
        data[Visit.KEY_USER_ID] = entity[Visit.KEY_USER_ID]
        data[Visit.KEY_USER_NAME] = entity[Visit.KEY_USER_NAME]
        data[Visit.KEY_THUMB_URL] = entity[Visit.KEY_THUMB_URL]
        data[Visit.KEY_USER_NAME] = entity[Visit.KEY_USER_NAME]
        data[Visit.KEY_PLACE] = entity[Visit.KEY_PLACE]
        data[Visit.KEY_START] = entity[Visit.KEY_START]
        data[Visit.KEY_END] = entity[Visit.KEY_END]
        data[Visit.KEY_COMMENT] = entity[Visit.KEY_COMMENT]
        try:
            data[Visit.KEY_PROBLEMS] = entity[Visit.KEY_PROBLEMS]
        except KeyError as error:
            self.log.debug(error)
            pass

        self.log.debug(json.dumps(data))

        return data

    def entities_to_jsonarray(self, entities):
        self.log.debug('entities_to_jsonarray')

        jsonobj = []

        for entity in entities:
            data = {}
            data[Visit.KEY_VISIT_ID] = entity[Visit.KEY_VISIT_ID]
            data[Visit.KEY_USER_ID] = entity[Visit.KEY_USER_ID]
            data[Visit.KEY_USER_NAME] = entity[Visit.KEY_USER_NAME]
            data[Visit.KEY_THUMB_URL] = entity[Visit.KEY_THUMB_URL]
            data[Visit.KEY_USER_NAME] = entity[Visit.KEY_USER_NAME]
            data[Visit.KEY_PLACE] = entity[Visit.KEY_PLACE]
            data[Visit.KEY_START] = entity[Visit.KEY_START]
            data[Visit.KEY_END] = entity[Visit.KEY_END]
            data[Visit.KEY_COMMENT] = entity[Visit.KEY_COMMENT]
            try:
                data[Visit.KEY_PROBLEMS] = entity[Visit.KEY_PROBLEMS]
            except KeyError as error:
                self.log.debug(error)
                pass

            jsonobj.append(data)

        return json.dumps(jsonobj)

    def json_to_entity(self, json, entity):
        self.log.debug('json_to_entity')
