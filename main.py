import sys
from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource

from server.const.const import User, Conversation, Host, Visit, HttpResponseCode

from server.util.logger import Logger

from server.datastore.datastore_manager import DatastoreManager


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
# app = Flask(__name__)
app = Flask(__name__, static_url_path='', static_folder='./app/dist/app')
app.config['JSON_AS_ASCII'] = False
api = Api(app)

log = Logger("DatastoreManager")


class User(Resource):

    def get(self):
        log.debug('get')
        user_id = request.args['user_id']
        # json_data = request.get_json(force=True)
        # json_data = request.get_json(force=True)
        # username = json_data[User.KEY_USER_NAME]
        # thumb_url = json_data[User.KEY_THUMB_URL]
        dataManager = DatastoreManager()
        return dataManager.get_user(user_id).get_result_json()

    def post(self):
        log.debug('post')
        user = request.json

        dataManager = DatastoreManager()
        result = dataManager.create_user(user)
        return result.get_result_json()

    def put(self):
        log.debug('put')
        user = request.json

        dataManager = DatastoreManager()
        return dataManager.update_user(user).get_result_json()


class Visit(Resource):

    def get(self):
        log.debug('get')
        visit_id = request.args['visit_id']
        log.debug(visit_id)
        dataManager = DatastoreManager()
        result = dataManager.get_visit(visit_id)
        return result.get_result_json()

    def post(self):
        log.debug('post')
        visit_data = request.json

        dataManager = DatastoreManager()
        return dataManager.create_visit(visit_data).get_result_json()


class Host(Resource):

    def get(self):
        log.debug('get')
        host_data = request.json
        dataManager = DatastoreManager()
        return dataManager.get_host().get_result_json()

    def post(self):
        log.debug('post')
        host_data = request.json
        dataManager = DatastoreManager()
        return dataManager.create_host(host_data).get_result_json()


class Conversation(Resource):

    def get(self):
        log.debug('Conversation get')
        conversation_id = request.args['conversation_id']
        log.debug(conversation_id)
        dataManager = DatastoreManager()
        return dataManager.get_conversation(conversation_id).get_result_json()

    def post(self):
        log.debug('Conversation post')
        conversation_data = request.json
        dataManager = DatastoreManager()
        return dataManager.create_conversation(conversation_data).get_result_json()

    def put(self):
        log.debug('Conversation put')
        return


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


api.add_resource(User, '/users')
api.add_resource(Host, '/hosts')
api.add_resource(Visit, '/visits')
api.add_resource(Conversation, '/conversations')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
