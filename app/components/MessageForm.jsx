import React from 'react';
import ReactDOM from 'react-dom';

import {waitForSocketConnection} from 'utils/utils';
import * as constants from 'utils/constants';

export default React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return { isTyping: false };
  },

  componentWillMount() {
    const {chat} = this.props;

    this.setState({ ws: new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${chat.id}/`) });
  },

  componentDidMount() {
    const {chat} = this.props;

    if(!chat.last_message_is_read && chat.last_message_sender_id.toString() === chat.interlocutor_id.toString()) {
      const message = {
        type: constants.READ_MESSAGE,
        interlocutorId: chat.interlocutor_id,
      }

      const ws = this.state.ws;
      waitForSocketConnection(ws, function() {
        ws.send(JSON.stringify(message));
      });
    }
  },

  componentWillUpdate(nextProps) {
    const {chat} = nextProps;

    if(chat.id !== this.props.chat.id) {
      this.state.ws.close();
      this.setState({ ws: new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${nextProps.chat.id}/`) });
    }
  },

  componentDidUpdate() {
    const {chat} = this.props;

    if(!chat.last_message_is_read && chat.last_message_sender_id.toString() === chat.interlocutor_id.toString()) {
      const message = {
        type: constants.READ_MESSAGE,
        interlocutorId: chat.interlocutor_id,
      }

      const ws = this.state.ws;
      waitForSocketConnection(ws, function() {
        ws.send(JSON.stringify(message));
      });
    }
  },

  componentWillUnmount() {
    const {chat} = this.props;

    if(this.state.isTyping) {
      clearTimeout(this.state.timeout);
      this.setState({ isTyping: false });
      this.state.ws.send(JSON.stringify({type: constants.IS_USER_TYPING,
                                         interlocutorId: chat.interlocutor_id}));
    }
  },

  handleKeyDown(e) {
    if(!e.shiftKey && e.keyCode == 13) {
      e.preventDefault();
      ReactDOM.findDOMNode(this.refs.SendButton).click();
    }
  },

  handleKeyPress() {
    const {chat} = this.props;

    clearTimeout(this.state.timeout);
    if(!this.state.isTyping) {
      this.setState({ isTyping: true });
      this.state.ws.send(JSON.stringify({type: constants.IS_USER_TYPING,
                                         interlocutorId: chat.interlocutor_id}));
    }
    let _this = this;
    const timeout =  setTimeout(function() {
      _this.setState({ isTyping: false });
      _this.state.ws.send(JSON.stringify({type: constants.IS_USER_TYPING,
                                          interlocutorId: chat.interlocutor_id}));
    }, 3000);
    this.setState({ timeout: timeout });
  },

  handleClick() {
    let text = this.refs.message.value;

    if(text.replace(/\s+/g, '') !== '') {
      const message = {
        type: constants.SEND_MESSAGE,
        interlocutorId: this.props.chat.interlocutor_id,
        message: text
      }

      this.state.ws.send(JSON.stringify(message));
      this.refs.message.value = '';
    }
  },

  render() {
    return <div className="MessageForm">
      <div className="NewsLine">
        {this.props.chat.is_interlocutor_typing ? <div className="LoadingDots">
                                                    {this.props.chat.interlocutor_username} is typing
                                                  </div> : <div></div>}
      </div>
      <textarea ref="message"
                type="text"
                placeholder="Type your text here"
                onKeyDown={this.handleKeyDown}
                onKeyPress={this.handleKeyPress}
                onKeyUp={this.handleKeyUp} />
      <button ref="SendButton" onClick={this.handleClick} />
    </div>
  }
});
