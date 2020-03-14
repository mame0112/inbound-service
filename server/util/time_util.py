import time

from server.util.logger import Logger


class TimeUtil():

    log = Logger("TimeUtil")

    def calcurate_next_time(self, additional_sec):
        return self.get_current_utc() + additional_sec

    def get_current_utc(self):
        return int(time.time())
