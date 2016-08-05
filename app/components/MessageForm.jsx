import React from 'react';

let ws;

export default React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired,
    onMessage: React.PropTypes.func.isRequired,
    onRead: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    const {chat, onMessage} = this.props;

    ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${chat.chat_id}/`);

    ws.onmessage = function(e) {
      onMessage(chat.chat_id, e.data);
    };
  },

  shouldComponentUpdate(nextProps) {
    const {chat, onRead} = nextProps;

    if(!chat.last_message_is_read) {
      const message = {
        type: 'READ_MESSAGE',
        interlocutorId: chat.interlocutor_id,
      }

      ws.send(JSON.stringify(message));
    }

    // TODO make return value more beautyful:)
    if(chat.chat_id === this.props.chat.chat_id) {
      return false;
    }
    else {
      return true;
    }
  },

  componentWillUpdate(nextProps) {
    ws.close();
    ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${nextProps.chat.chat_id}/`);

    ws.onmessage = function(e) {
      nextProps.onMessage(nextProps.chat.chat_id, e.data);
    };
  },

  handleClick() {
    const message = {
      type: 'SEND_MESSAGE',
      interlocutorId: this.props.chat.interlocutor_id,
      message: this.refs.message.value
    }

    ws.send(JSON.stringify(message));
    this.refs.message.value = '';
  },

  render() {
    return <div className="MessageForm">
      <textarea ref="message" type="text" placeholder="Type your text here" />
      <button onClick={this.handleClick}>Send</button>
    </div>
  }
});
