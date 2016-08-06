import React from 'react';
import dateFormat from 'dateformat';

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
    const lastMessageClassName = chat.last_message_is_read ? 'LastMessage' : 'LastMessage-unread';
    const lastMessageTimestamp = new Date(chat.last_message_timestamp);
    const currentDate = new Date();
    let messageTimestamp;

    if(currentDate.getYear() !== lastMessageTimestamp.getYear()) {
      messageTimestamp = dateFormat(lastMessageTimestamp, 'mmm d yyyy');
    }
    else if(currentDate.getDate() === lastMessageTimestamp.getDate()) {
      messageTimestamp = dateFormat(lastMessageTimestamp, 'h:MM TT');
    }
    else if((currentDate.getDate() - 1) === lastMessageTimestamp.getDate())
      messageTimestamp = 'yesterday';
    else {
      messageTimestamp = dateFormat(lastMessageTimestamp, 'mmm d');
    }

    return <div className={className} onClick={this.handleClick}>
      <div className="ChatInfo">
        <span>{chat.interlocutor_username}</span>
        <div className="LastMessageTimestamp">{messageTimestamp}</div>
      </div>
      <div className={lastMessageClassName}>
        {chat.is_interlocutor_typing ? Typing : chat.last_message}
      </div>
    </div>;
  }
});
