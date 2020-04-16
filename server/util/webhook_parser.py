from server.const.const import Consts

from server.util.logger import Logger


class WebhookParser():

    log = Logger("ShortcutCreator")

    def extract_data_from_webhook_data(self, data):
        self.log.debug('extract_data_from_webhook_data')

        if data is None:
            self.log.debug('data is None')
            return

        event = data['entry'][0]['messaging']
        for x in event:
            if (x.get('message') and x['message'].get('text')):
                # message = x['message']['text']
                psid = x['sender']['id']
                self.log.debug('psid')
                self.log.debug(psid)

                user_id = x['optin']['ref']
                self.log.debug('user_id')
                self.log.debug(user_id)
                return user_id, psid
        else:
            return Consts.NO_USER, Consts.NO_PSID
