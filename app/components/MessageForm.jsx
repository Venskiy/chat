import React from 'react';

import {waitForSocketConnection} from 'utils/utils';

let ws;

export default React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired,
    onMessage: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    const {chat} = this.props;

    ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${chat.chat_id}/`);
  },

  componentDidMount() {
    const {chat} = this.props;

    // TODO switch to other checks
    if(!chat.last_message_is_read && chat.last_message_sender_id.toString() === chat.interlocutor_id.toString()) {
      const message = {
        type: 'READ_MESSAGE',
        interlocutorId: chat.interlocutor_id,
      }

      waitForSocketConnection(ws, function() {
        ws.send(JSON.stringify(message));
      });
    }
  },

  componentWillUpdate(nextProps) {
    const {chat} = nextProps;

    if(chat.chat_id !== this.props.chat.chat_id) {
      ws.close();
      ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${nextProps.chat.chat_id}/`);
    }
  },

  componentDidUpdate() {
    const {chat} = this.props;

    // TODO switch to other checks
    if(!chat.last_message_is_read && chat.last_message_sender_id.toString() === chat.interlocutor_id.toString()) {
      const message = {
        type: 'READ_MESSAGE',
        interlocutorId: chat.interlocutor_id,
      }

      waitForSocketConnection(ws, function() {
        ws.send(JSON.stringify(message));
      });
    }
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
    console.log(this.props.chat);
    return <div className="MessageForm">
      <textarea ref="message" type="text" placeholder="Type your text here" />
      <button onClick={this.handleClick}>Send</button>
    </div>
  }
});
