import sys
from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource

from server.const.const import User, Conversation, Host, Visit

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
        json_data = request.get_json(force=True)
        # json_data = request.get_json(force=True)
        # username = json_data[User.KEY_USER_NAME]
        # thumb_url = json_data[User.KEY_THUMB_URL]
        dataManager = DatastoreManager()
        res = dataManager.get_user(user_id)
        result = res[0]
        if result.get_http_response_code == HttpResponseCode.OK:
            return res[1]
        else:
            return result

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
        return dataManager.update_user(user)


class Conversation(Resource):

    def get(self):
        log.debug('get')
        return

# @app.route('/users/<int:userid>', methods=['GET'])
# def get_user(userid=None):
#     dataManager = DatastoreManager()
#     return dataManager.get_user(userid)
    # return app.send_static_file('index.html')


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


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
