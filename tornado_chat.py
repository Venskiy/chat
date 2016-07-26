import os.path
import json

import brukva
import tornado.ioloop
import tornado.web
import tornado.websocket

c = brukva.Client()
c.connect()

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/tornado_chat', ChatHandler),
            (r'/ws', WebSocketHandler),
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), 'static'),
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class ChatHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('chat.html')


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def __init__(self, *args, **kwargs):
        super(WebSocketHandler, self).__init__(*args, **kwargs)
        self.client = brukva.Client()
        self.client.connect()

    def open(self):
        self.channel = '1'
        self.client.subscribe(self.channel)
        self.client.listen(self.show_new_message)

    def on_message(self, msg):
        c.publish(self.channel, msg)

    def show_new_message(self, result):
        self.write_message(result.body)

    def on_close(self):
        try:
            self.client.unsubscribe(self.channel)
        except AttributeError:
            pass
        def check():
            if self.client.connection.in_progress:
                tornado.ioloop.IOLoop.instance().add_timeout(
                    datetime.timedelta(0.00001),
                    check
                )
            else:
                self.client.disconnect()
        tornado.ioloop.IOLoop.instance().add_timeout(
            datetime.timedelta(0.00001),
            check
        )


def main():
    port = int(os.environ.get("PORT", 8000))
    app = Application()
    app.listen(port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
