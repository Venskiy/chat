import React from 'react';

const dateFormat = require('dateformat');

export default React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired,
    selectedChat: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  handleClick() {
    this.props.onSelect(this.props.chat.chat_id);
  },

  render () {
    const {chat, selectedChat} = this.props;
    const className = (chat.chat_id === selectedChat) ? 'Chat-selected' : 'Chat';
    const lastMessageClassName = chat.last_message_is_read ? 'LastMessage' : 'LastMessage-unread'
    const messageTimestamp = dateFormat(chat.last_message_timestamp, 'mmm d')

    return <div className={className} onClick={this.handleClick}>
      <div className="ChatInfo">
        <span>{chat.interlocutor_username}</span>
        <div className="Timestamp">{messageTimestamp}</div>
      </div>
      <div className={lastMessageClassName}>{chat.last_message}</div>
    </div>;
  }
});
