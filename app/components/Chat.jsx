import React from 'react';

const dateFormat = require('dateformat');

export default React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired,
    selectedChat: React.PropTypes.object.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  handleClick() {
    this.props.onSelect(this.props.chat);
  },

  render () {
    const {chat, selectedChat} = this.props;
    const className = (chat.chat_id === selectedChat.chat_id) ? 'Chat-selected' : 'Chat';
    const messageTimestamp = dateFormat(chat.last_message_timestamp, 'mmm d')

    return <div className={className} onClick={this.handleClick}>
      {chat.interlocutor_username}
      {chat.last_message}
      {messageTimestamp}
    </div>;
  }
});
