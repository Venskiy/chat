import React from 'react';

let ws;

export default React.createClass({
  propTypes: {
    chatId: React.PropTypes.string.isRequired,
    onMessage: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    const {chatId, onMessage} = this.props;

    ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${chatId}/`);

    ws.onmessage = function(e) {
      console.log('mount onmessage');
      onMessage(chatId, e.data);
    };
  },

  shouldComponentUpdate(nextProps) {
    if(nextProps.chatId === this.props.chatId) {
      return false;
    }
    else {
      return true;
    }
  },

  componentWillUpdate(nextProps) {
    ws.close();
    ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${nextProps.chatId}/`);

    ws.onmessage = function(e) {
      nextProps.onMessage(nextProps.chatId, e.data);
    };
  },

  handleClick() {
    const message = this.refs.message.value;
    ws.send(message);
    this.refs.message.value = '';
  },

  render() {
    return <div className="MessageForm">
      <input className="MessageText" ref="message" type="text" placeholder="Type your text here" />
      <button onClick={this.handleClick} />
    </div>
  }
});
