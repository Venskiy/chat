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

  componentWillUnmount() {
    const {chat} = this.props;

    if(isTyping) {
      clearTimeout(timeout);
      isTyping = false;
      ws.send(JSON.stringify({type: 'IS_USER_TYPING', interlocutorId: chat.interlocutor_id}));
    }
  },

  handleKeyPress() {
    const {chat} = this.props;

    clearTimeout(timeout);
    const value = this.refs.message.value;
    if(!isTyping) {
      isTyping = true;
      ws.send(JSON.stringify({type: 'IS_USER_TYPING', interlocutorId: chat.interlocutor_id}));
    }
    timeout =  setTimeout(function() {
      isTyping = false;
      ws.send(JSON.stringify({type: 'IS_USER_TYPING', interlocutorId: chat.interlocutor_id}));
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
      {this.props.chat.is_interlocutor_typing ? <div className="LoadingDots">{this.props.chat.interlocutor_username} is typing</div> : <div></div>}
      <textarea ref="message" type="text" placeholder="Type your text here" onKeyPress={this.handleKeyPress} />
      <button onClick={this.handleClick}>Send</button>
    </div>
  }
});
