import json
import threading
import time

from server.util.logger import Logger


class WebhookManager:

    log = Logger("WebhookManager")

    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.log.debug('Initialize')

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
            return cls._instance

    def post_webhook(self, request):
