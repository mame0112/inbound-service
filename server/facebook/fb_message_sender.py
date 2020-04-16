# import json
import json

import requests

from server.util.logger import Logger

URL = "https://graph.facebook.com/v6.0/me/messages?access_token="


class FacebookMessageSender():

    log = Logger("FacebookMessageSender")

    def send(self):
        self.log.debug('send_notification')
        # self.log.debug(type(user_id))

        # self.log.debug(url)

        f = open('facebook_setting.json', 'r')
        fb_settings = json.load(f)

        payload = {}
        recipient = {}
        message = {}

        payload['messaging_type'] = 'RESPONSE'

        recipient['id'] = '3079624638743721'
        payload['recipient'] = recipient

        message['text'] = "hello, world!"
        payload['message'] = message
        # payload['access_token'] = page_access_token

        payload['access_token'] = fb_settings['page_access_token']
        self.log.debug(payload['access_token'])

        response = requests.post(URL, json=payload)

        if response is not None:
            self.log.debug(response)
            self.log.debug(response.text)
        else:
            self.log.debug('Else')
            return None

        return
