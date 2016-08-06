import React from 'react';

import {waitForSocketConnection} from 'utils/utils';

let ws;
let timeout;
let isTyping = false;

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

  componentWillUnmount() {
    if(isTyping) {
      clearTimeout(timeout);
      isTyping = false;
      console.log('stop');
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

  handleKeyPress() {
    clearTimeout(timeout);
    const value = this.refs.message.value;
    if(!isTyping) {
      isTyping = true;
      console.log(`start ${value}`);
    }
    timeout =  setTimeout(function() {
      isTyping = false;
      console.log(`stop ${value}`);
    }, 3000)
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
      <textarea ref="message" type="text" placeholder="Type your text here" onKeyPress={this.handleKeyPress} />
      <button onClick={this.handleClick}>Send</button>
    </div>
  }
});
