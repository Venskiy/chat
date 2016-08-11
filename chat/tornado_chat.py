import os.path
import json
from datetime import datetime
from urllib.parse import urlencode
from importlib import import_module
from chat.utils import date_handler
from chat import constants

import tornado.httpserver
import tornado.web
import tornado.websocket
import tornado.ioloop
import tornado.gen
import tornadoredis

from django.conf import settings
from django.contrib.auth.models import User

from chat.models import Chat

session_engine = import_module(settings.SESSION_ENGINE)

c = tornadoredis.Client()
c.connect()

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/chat_app/(?P<user_id>\d+)/', ChatAppHandler),
            (r'/tornado_chat/(?P<chat_id>\d+)/', TornadoChatHandler),
        ]
        settings = dict(
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class ChatAppHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, *args, **kwargs):
        super(ChatAppHandler, self).__init__(*args, **kwargs)
        self.client = tornadoredis.Client()
        self.client.connect()

    @tornado.gen.engine
    def open(self, user_id):
        self.user_id = user_id

        session_key = self.get_cookie(settings.SESSION_COOKIE_NAME)
        session = session_engine.SessionStore(session_key)

        try:
            if user_id != session['_auth_user_id']:
                self.close()
                return
            self.username = User.objects.get(id=self.user_id).username
        except (KeyError, User.DoesNotExist):
                self.close()
                return

        yield tornado.gen.Task(self.client.subscribe, 'user_{}'.format(user_id))
        self.client.listen(self.handle_action)

    def check_origin(self, origin):
        if origin == 'http://127.0.0.1:8000':
            return True
        else:
            return False

    def on_message(self, msg):
        pass

    def handle_action(self, msg):
        if msg.kind == 'message':
            self.write_message(msg.body)
        if msg.kind == 'disconnect':
            self.write_message('The connection terminated '
                               'due to a Redis server error.')
            self.close()

    def on_close(self):
        if self.client.subscribed:
            self.client.unsubscribe('user_{}'.format(self.user_id))

        self.client.disconnect()



class TornadoChatHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, *args, **kwargs):
        super(TornadoChatHandler, self).__init__(*args, **kwargs)
        self.client = tornadoredis.Client()
        self.client.connect()

    @tornado.gen.engine
    def open(self, chat_id):
        self.chat_id = chat_id

        session_key = self.get_cookie(settings.SESSION_COOKIE_NAME)
        session = session_engine.SessionStore(session_key)

        try:
            self.user_id = session['_auth_user_id']
            self.username = User.objects.get(id=self.user_id).username
        except (KeyError, User.DoesNotExist):
            self.close()
            return

        if not Chat.objects.filter(id=chat_id, participants__id=self.user_id).exists():
            self.close()
            return

        yield tornado.gen.Task(self.client.subscribe, 'chat_{}'.format(chat_id))
        self.client.listen(self.show_new_message)

    def check_origin(self, origin):
        if origin == 'http://127.0.0.1:8000':
            return True
        else:
            return False

    def handle_request(self, response):
        pass

    def on_message(self, msg):
        msg = json.loads(msg)
        http_client = tornado.httpclient.AsyncHTTPClient()

        if msg['type'] == constants.SEND_MESSAGE:
            message = {
                'type': msg['type'],
                'chat_id': self.chat_id,
                'message': {
                    'text': msg['message'],
                    'sender_id': self.user_id,
                    'sender_username': self.username,
                    'timestamp': datetime.now()
                }
            }

            c.publish('user_{}'.format(self.user_id), json.dumps(message, default=date_handler))
            c.publish('user_{}'.format(msg['interlocutorId']), json.dumps(message, default=date_handler))

            request = tornado.httpclient.HTTPRequest(
                ''.join([settings.SEND_MESSAGE_API_URL, "/",]),
                method='POST',
                body=urlencode({
                    'sender_id': self.user_id,
                    'message': msg['message'],
                    'chat_id': self.chat_id,
                    'api_key': settings.API_KEY,
                })
            )
            http_client.fetch(request, self.handle_request)
        elif msg['type'] == constants.READ_MESSAGE:
            message = {
                'type': msg['type'],
                'chat_id': self.chat_id
            }

            c.publish('user_{}'.format(self.user_id), json.dumps(message))
            c.publish('user_{}'.format(msg['interlocutorId']), json.dumps(message))

            request = tornado.httpclient.HTTPRequest(
                ''.join([settings.READ_MESSAGE_API_URL, "/",]),
                method='POST',
                body=urlencode({
                    'reader_id': self.user_id,
                    'chat_id': self.chat_id
                })
            )
            http_client.fetch(request, self.handle_request)
        elif msg['type'] == constants.IS_USER_TYPING:
            message = {
                'type': msg['type'],
                'chat_id': self.chat_id
            }

            c.publish('user_{}'.format(msg['interlocutorId']), json.dumps(message))
        elif msg['type'] == constants.DISPLAY_CHAT_ON_RECIPIENT_SIDE:
            recipient_id = msg['chat']['interlocutor_id']

            msg['chat']['interlocutor_id'] = self.user_id
            msg['chat']['interlocutor_username'] = self.username

            c.publish('user_{}'.format(recipient_id), json.dumps(msg))

    def show_new_message(self, msg):
        if msg.kind == 'message':
            self.write_message(str(msg.body))
        if msg.kind == 'disconnect':
            self.write_message('The connection terminated '
                               'due to a Redis server error.')
            self.close()

    def on_close(self):
        if self.client.subscribed:
            self.client.unsubscribe('chat_{}'.format(self.chat_id))

        self.client.disconnect()

app = Application()
