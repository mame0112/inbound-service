from server.const.const import Consts


class MessageContentGenerator():

    def generate_matching_message_for_host(self, conversation_id):
        return 'Thank you for using Traca. Now we find new visitor to Japan. Please contact to him/her from: ' + Consts.BASE_URL + Consts.ENDPOINT_CONVERSATION + str(conversation_id)

    def generate_matching_message_for_visitor(self, conversation_id):
        return 'Thank you for using Traca. Now we find your host for your travel. Please contact to him/her from: ' + Consts.BASE_URL + Consts.ENDPOINT_CONVERSATION + str(conversation_id)

    def generate_waiting_message_for_host(self):
        return 'Thank you very much for using Traca. We would let you know as soon as we find new traveler.'

    def generate_waiting_message_for_visitor(self):
        return 'Thank you very much for using Traca. We would let you know as soon as we find your host.'
