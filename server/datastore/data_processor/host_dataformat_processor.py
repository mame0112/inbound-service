import json

from server.const.const import Host

from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.util.logger import Logger


class HostDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("HostDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entity_to_json(self, entity):
        self.log.debug('entity_to_json')
        data = {}
        data[Host.KEY_USER_ID] = entity[Host.KEY_USER_ID]
        data[Host.KEY_USER_NAME] = entity[Host.KEY_USER_NAME]
        data[Host.KEY_THUMB_URL] = entity[Host.KEY_THUMB_URL]

        self.log.debug(json.dumps(data))

        # json_data = json.dumps(data)

        return data

    def json_to_entity(self, host_json, entity):
        self.log.debug('json_to_entity')

        entity[Host.KEY_USER_ID] = host_json[Host.KEY_USER_ID]
        entity[Host.KEY_USER_NAME] = host_json[Host.KEY_USER_NAME]
        entity[Host.KEY_THUMB_URL] = host_json[Host.KEY_THUMB_URL]

        return entity
