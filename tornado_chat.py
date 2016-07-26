import os.path

import tornado.ioloop
import tornado.web
import tornado.websocket

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
    connections = set()

    def open(self):
        WebSocketHandler.connections.add(self)

    def on_close(self):
        WebSocketHandler.connections.remove(self)

    def on_message(self, msg):
        self.send_messages(msg)

    def send_messages(self, msg):
        for conn in self.connections:
            conn.write_message(msg)


def main():
    port = int(os.environ.get("PORT", 8000))
    app = Application()
    app.listen(port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
