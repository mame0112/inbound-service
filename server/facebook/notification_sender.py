# import json

import requests

from server.util.logger import Logger

BASE_URL = 'https://graph.facebook.com/'
NOTIFICATION_URL = '/notifications'


class NotificationSender():

    log = Logger("NotificationSender")

    def send_notification(self, user_id, access_token):
        self.log.debug('send_notification')
        self.log.debug(type(user_id))

        url = BASE_URL + user_id + NOTIFICATION_URL

        self.log.debug(url)

        # f = open('facebook_setting.json', 'r')
        # fb_settings = json.load(f)

        payload = {}
        payload['ref'] = 'XXXXX'
        payload['href'] = 'http://localhost:8000/'
        payload['seen'] = True
        payload['template'] = 'template_test'
        payload['type'] = 'generic'
        payload['notif_ids'] = 12354
        payload['read'] = True
        payload['access_token'] = access_token
        # payload['access_token'] = fb_settings['app_access_token']

        response = requests.post(url, json=payload)

        if response is not None:
            self.log.debug(response)
            self.log.debug(response.text)
        else:
            self.log.debug('Else')
            return None

        return
