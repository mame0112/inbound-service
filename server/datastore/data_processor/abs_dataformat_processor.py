from abc import ABC, abstractmethod


class AbstractDataFormatProcessor(ABC):

    @abstractmethod
    def entity_to_json(self, entity):
        pass

    @abstractmethod
    def json_to_entity(self, json, entity):
        pass
