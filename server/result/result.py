from server.util.logger import Logger

from server.const.const import HttpResponseCode


class Result:
    log = Logger("Result")

    responseCode = HttpResponseCode.OK
    message = None

    def __init__(self):
        self.log.debug('Initialize')

    def set_http_response_code(self, responseCode):
        this.responseCode = responseCode

    def set_error_message(self, message):
        this.message = message

    def is_successed(self):
        return True if this.responseCode == HttpResponseCode.OK else False

    def get_http_response_code(self):
        return self.responseCode

    def get_error_message(self):
        return self.message

    def get_result_json(self):
        return {
            "responseCode": self.responseCode,
            "message": self.message
        }
