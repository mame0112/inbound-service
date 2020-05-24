from flask import Flask, request
from flask_restful import Api, Resource

from server.const.const import User, Conversation, Host, Visit

from server.util.logger import Logger

from server.datastore.datastore_manager import DatastoreManager
from server.util.webhook_parser import WebhookParser

from server.util.userdata_builder import UserDataBuilder

from server.facebook.message_content_generator import MessageContentGenerator
from server.facebook.fb_message_sender import FacebookMessageSender


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
# app = Flask(__name__)
app = Flask(__name__, static_url_path='', static_folder='./app/dist/app')
app.config['JSON_AS_ASCII'] = False
api = Api(app)

log = Logger("Main")


class User(Resource):

    def get(self):
        log.debug('User get')
        user_id = request.args['user_id']

        # json_data = request.get_json(force=True)
        # json_data = request.get_json(force=True)
        # username = json_data[User.KEY_USER_NAME]
        # thumb_url = json_data[User.KEY_THUMB_URL]
        data_manager = DatastoreManager()
        return data_manager.get_user(user_id).get_result_json()

    def post(self):
        log.debug('User post')
        user = request.json
        log.debug(user)

        data_manager = DatastoreManager()
        result = data_manager.create_user(user)
        return result.get_result_json()

    def put(self):
        log.debug('User put')
        user = request.json

        data_manager = DatastoreManager()
        return data_manager.update_user(user).get_result_json()

    def delete(self):
        log.debug('User delete')
        data_manager = DatastoreManager()
        return data_manager.delete_user().get_result_json()


class Visit(Resource):

    def get(self):
        log.debug('Visit get')
        visit_id = request.args['visit_id']
        log.debug(visit_id)
        data_manager = DatastoreManager()
        result = data_manager.get_visit(visit_id)
        return result.get_result_json()

    def post(self):
        log.debug('Visit post')
        visit_data = request.json

        data_manager = DatastoreManager()
        return data_manager.create_visit(visit_data).get_result_json()

    def delete(self):
        log.debug('Visit delete')
        data_manager = DatastoreManager()
        return data_manager.delete_visit().get_result_json()


class Host(Resource):

    def get(self):
        log.debug('Host get')
        # host_data = request.json
        data_manager = DatastoreManager()
        return data_manager.get_host().get_result_json()

    def post(self):
        log.debug('Host post')
        host_data = request.json
        data_manager = DatastoreManager()
        return data_manager.create_host(host_data).get_result_json()

    def delete(self):
        log.debug('Host delete')
        data_manager = DatastoreManager()
        return data_manager.delete_host().get_result_json()


class Conversation(Resource):

    def get(self):
        log.debug('Conversation get')
        conversation_id = request.args['conversation_id']
        log.debug(conversation_id)
        data_manager = DatastoreManager()
        return data_manager.get_conversation(conversation_id).get_result_json()

    def post(self):
        log.debug('Conversation post')
        conversation_data = request.json
        data_manager = DatastoreManager()
        return data_manager.create_conversation(conversation_data).get_result_json()

    def put(self):
        log.debug('Conversation put')
        conversation_data = request.json
        data_manager = DatastoreManager()
        return data_manager.update_conversation(conversation_data).get_result_json()

    def delete(self):
        log.debug('Conversation delete')
        data_manager = DatastoreManager()
        return data_manager.delete_conversation().get_result_json()


class Comment(Resource):

    def get(self):
        log.debug('Comment get')
        return

    def post(self):
        log.debug('Comment post')
        return

    def put(self):
        log.debug('Comment put')
        comment_data = request.json
        data_manager = DatastoreManager()
        return data_manager.update_comment(comment_data).get_result_json()


class State(Resource):

    def delete(self):
        log.debug('State delete')
        data_manager = DatastoreManager()
        return data_manager.delete_state().get_result_json()


@app.route('/callback/<input>')
def callback(input):
    log.debug('callback')
    # dataManager = DatastoreManager()
    # dataManager.create_user(input)
    return app.send_static_file('index.html')


@app.route('/')
def angular():
    log.debug('Root')
    return app.send_static_file('index.html')


@app.route('/webhook', methods=['GET'])
def webhookget():
    log.debug('webhook get')
    mode = request.args.get("hub.mode", "")
    token = request.args.get("hub.verify_token", "")
    challenge = request.args.get("hub.challenge", "")
    if mode == 'subscribe' and token == 'token':
        log.debug('OK')
        return challenge
    return


@app.route('/webhook', methods=['POST'])
def webhookpost():
    log.debug('webhook post')
    output = request.json
    log.debug(output)
    parser = WebhookParser()
    user_id, psid = parser.extract_data_from_webhook_data(output)

    builder = UserDataBuilder()
    builder.set_user_id(user_id).set_psid(psid)
    log.debug(builder.get_result())

    data_manager = DatastoreManager()
    data_manager.update_user(builder.get_result())

    # Send Facebook Message
    sender = FacebookMessageSender()
    sender.send(psid, MessageContentGenerator(
    ).generate_waiting_message_for_host())

    return "success"


api.add_resource(User, '/users')
api.add_resource(Host, '/hosts')
api.add_resource(Visit, '/visits')
api.add_resource(Conversation, '/conversations')
api.add_resource(Comment, '/comments')
api.add_resource(State, '/state')
# api.add_resource(Webhook, '/webhook')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=False)
