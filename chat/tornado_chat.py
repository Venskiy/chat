import os.path
import json
from urllib.parse import urlencode
from importlib import import_module

import tornado.httpserver
import tornado.web
import tornado.websocket
import tornado.ioloop
import tornado.gen
import tornadoredis

from django.conf import settings

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
        # TODO some checks

        self.user = user_id

        yield tornado.gen.Task(self.client.subscribe, 'user_{}'.format(user_id))
        self.client.listen(self.perform_action)

    def check_origin(self, origin):
        if origin == 'http://127.0.0.1:8000':
            return True
        else:
            return False

    def perform_action(self, action):
        pass

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
        # TODO some checks

        self.chat_id = chat_id

        session_key = self.get_cookie(settings.SESSION_COOKIE_NAME)
        session = session_engine.SessionStore(session_key)

        self.user_id = session['_auth_user_id']

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
        c.publish('chat_{}'.format(self.chat_id), msg)

        http_client = tornado.httpclient.AsyncHTTPClient()
        request = tornado.httpclient.HTTPRequest(
            ''.join([settings.SEND_MESSAGE_API_URL, "/",]),
            method='POST',
            body=urlencode({
                'sender_id': self.user_id,
                'message': msg.encode('utf-8'),
                'chat_id': self.chat_id,
                'api_key': settings.API_KEY,
            })
        )
        http_client.fetch(request, self.handle_request)

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
