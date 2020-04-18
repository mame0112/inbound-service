from server.const.const import Consts

from server.util.logger import Logger


class WebhookParser():

    log = Logger("ShortcutCreator")

    def extract_data_from_webhook_data(self, data):
        self.log.debug('extract_data_from_webhook_data')
        self.log.debug(data)

        psid = Consts.NO_PSID
        user_id = Consts.NO_USER

        if data is None:
            self.log.debug('data is None')
            return

        event = data['entry'][0]['messaging']
        for x in event:
            if (x.get('sender') and x['sender'].get('id')):
                # if (x.get('message') and x['message'].get('text')):
                # message = x['message']['text']
                psid = x['sender']['id']
                self.log.debug('psid')
                self.log.debug(psid)

            if (x.get('optin') and x['optin'].get('ref')):
                user_id = x['optin']['ref']
                self.log.debug('user_id')
                self.log.debug(user_id)

        return user_id, psid

        # for x in event:
        #     if (x.get('message') and x['message'].get('text')):
        #         # if (x.get('message') and x['message'].get('text')):
        #         # message = x['message']['text']
        #         psid = x['sender']['id']
        #         self.log.debug('psid')
        #         self.log.debug(psid)

        #         user_id = x['optin']['ref']
        #         self.log.debug('user_id')
        #         self.log.debug(user_id)
        #         return user_id, psid
        #     else:
        #         return Consts.NO_USER, Consts.NO_PSID
