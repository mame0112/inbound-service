from server.util.logger import Logger

from server.const.const import HttpResponseCode


class Result:
    log = Logger("Result")

    response_code = HttpResponseCode.OK
    message = None
    content = {}

    def __init__(self):
        self.log.debug('Initialize')

    def set_http_response_code(self, response_code):
        self.response_code = response_code

    def set_error_message(self, message):
        self.message = message

    def set_content(self, content):
        self.content = content

    def is_successed(self):
        return True if self.response_code == HttpResponseCode.OK else False

    def get_http_response_code(self):
        return self.responseCode

    def get_error_message(self):
        return self.message

    def get_content(self):
        return self.content

    def get_result_json(self):
        return {
            "responseCode": self.response_code,
            "message": self.message,
            "content": self.content
        }
