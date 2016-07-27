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
            (r'/ws', WebSocketHandler),
        ]
        settings = dict(
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, *args, **kwargs):
        super(WebSocketHandler, self).__init__(*args, **kwargs)
        self.listen()

    def check_origin(self, origin):
        if origin == 'http://127.0.0.1:8000':
            return True
        else:
            return False

    @tornado.gen.engine
    def listen(self):
        self.client = tornadoredis.Client()
        self.client.connect()
        yield tornado.gen.Task(self.client.subscribe, 'test_channel')
        self.client.listen(self.show_new_message)

    def handle_request(self, response):
        pass

    def on_message(self, msg):
        c.publish('test_channel', msg)

        http_client = tornado.httpclient.AsyncHTTPClient()
        request = tornado.httpclient.HTTPRequest(
            "".join([settings.SEND_MESSAGE_API_URL, "/",]),
            method="POST",
            body=urlencode({
                "message": msg.encode("utf-8"),
                "api_key": settings.API_KEY,
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
            self.client.unsubscribe('test_channel')
            self.client.disconnect()

app = Application()
