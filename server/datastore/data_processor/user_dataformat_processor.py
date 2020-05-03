import json

from server.util.logger import Logger
from server.datastore.data_processor.abs_dataformat_processor import AbstractDataFormatProcessor

from server.const.const import User, Host


class UserDataFormatProcessor(AbstractDataFormatProcessor):

    log = Logger("UserDataFormatProcessor")

    def __init__(self):
        self.log.debug('Initialize')

    def entity_to_json(self, entity):
        self.log.debug('entity_to_json')

        data = {}

        try:
            data[User.KEY_USER_ID] = entity[User.KEY_USER_ID]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_USER_NAME] = entity[User.KEY_USER_NAME]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_THUMB_URL] = entity[User.KEY_THUMB_URL]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_ACCESS_TOKEN] = entity[User.KEY_ACCESS_TOKEN]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_CONVERSATIONS_HOST] = entity[
                User.KEY_CONVERSATIONS_HOST]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_CONVERSATIONS_GUEST] = entity[
                User.KEY_CONVERSATIONS_GUEST]
        except ValueError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_USER_PROPERTIES] = entity[User.KEY_USER_PROPERTIES]
        except ValueError as error:
            pass
        except KeyError as error:
            # Nothing to do
            pass

        try:
            data[User.KEY_PLANS] = entity[User.KEY_PLANS]
        except ValueError as error:
            self.log.debug(error)
        except KeyError as error:
            # Nothing to do
            self.log.debug(error)

        self.log.debug(json.dumps(data))

        return data

    def json_to_entity(self, host_json, entity):
        self.log.debug('json_to_entity')

        try:
            entity[Host.KEY_USER_ID] = host_json[Host.KEY_USER_ID]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass

        try:
            entity[Host.KEY_USER_NAME] = host_json[Host.KEY_USER_NAME]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass

        try:
            entity[Host.KEY_THUMB_URL] = host_json[Host.KEY_THUMB_URL]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass

        try:
            entity[Host.KEY_CONVERSATIONS_HOST] = host_json[
                Host.KEY_CONVERSATIONS_HOST]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass

        try:
            entity[Host.KEY_CONVERSATIONS_GUEST] = host_json[
                Host.KEY_CONVERSATIONS_GUEST]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass

        try:
            entity[Host.KEY_USER_PROPERTIES] = host_json[
                Host.KEY_USER_PROPERTIES]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass

        try:
            entity[Host.KEY_PLANS] = host_json[Host.KEY_PLANS]
        except ValueError:
            pass
        except KeyError:
            # Nothing to do
            pass
        return entity
