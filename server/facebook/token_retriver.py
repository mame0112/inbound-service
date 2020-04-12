import requests
import json

from server.util.logger import Logger
from server.util.time_util import TimeUtil

TOKEN_URL = 'https://graph.facebook.com/oauth/access_token'

DUMMY_EXPIRES_IN = 5184000


class TokenRetriever():

    log = Logger("TokenRetriever")

    def exchange_token(self, token):
        self.log.debug('exchange_token')

        f = open('facebook_setting.json', 'r')
        fb_settings = json.load(f)

        payload = {}
        payload['client_id'] = fb_settings['client_id']
        payload['client_secret'] = fb_settings['client_secret']
        payload['grant_type'] = 'fb_exchange_token'
        payload['fb_exchange_token'] = token
        response = requests.get(TOKEN_URL, params=payload)

        if response is not None:
            self.log.debug(response.text)

            response_json = json.loads(response.text)
            token_json = None
            expire_in = DUMMY_EXPIRES_IN

            try:
                token_json = response_json['access_token']
            except KeyError as error:
                self.log.debug(error)
                return None

            try:
                expire_in = response_json['expires_in']
            except KeyError as error:
                self.log.debug(error)
                self.log.debug('Use dummy exipres_in')
                expire_in = DUMMY_EXPIRES_IN

            util = TimeUtil()
            expire_time = util.calcurate_next_time(expire_in)
            return token_json, expire_time

        else:
            return None
