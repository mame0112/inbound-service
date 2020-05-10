# import json
import json

import requests

from server.util.logger import Logger

URL = "https://graph.facebook.com/v6.0/me/messages?access_token="


class FacebookMessageSender():

    log = Logger("FacebookMessageSender")

    def send(self, target_user_psid, message_content):
        self.log.debug('send')

        if target_user_psid is None or message_content is None:
            self.log.debug('target_user_psid or message_content is null')
            return False

        f = open('facebook_setting.json', 'r')
        fb_settings = json.load(f)

        payload = {}
        recipient = {}
        message = {}

        payload['messaging_type'] = 'RESPONSE'

        # recipient['id'] = '3079624638743721'
        recipient['id'] = target_user_psid
        payload['recipient'] = recipient

        message['text'] = message_content
        payload['message'] = message
        # payload['access_token'] = page_access_token

        payload['access_token'] = fb_settings['page_access_token']
        self.log.debug(payload['access_token'])

        self.log.debug(payload)

        response = requests.post(URL, json=payload)

        if response is not None:
            self.log.debug(response)
            self.log.debug(response.text)
            return True
        else:
            self.log.debug('Else')
            return False

        return False
