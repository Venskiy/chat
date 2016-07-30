import React from 'react';

let ws;

export default React.createClass({
  propTypes: {
    chatId: React.PropTypes.string.isRequired
  },

  componentWillMount() {
    ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${this.props.chatId}/`);

    ws.onmessage = function(e) {
      alert(e.data);
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
