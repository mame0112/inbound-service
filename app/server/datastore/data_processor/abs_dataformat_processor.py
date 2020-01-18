from abc import ABCMeta, abstractmethod


class AbstractDataFormatProcessor(metaclass=ABCMeta):

    @abstractmethod
    def entityToJson(self, entity):
        pass

    @abstractmethod
    def jsonToEntity(self, json):
        pass
