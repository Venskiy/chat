import React from 'react';

import {getMessageTimestamp} from 'utils/utils';

export default React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired,
    selectedChat: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  handleClick() {
    this.props.onSelect(this.props.chat.id);
  },

  render () {
    const {chat, selectedChat} = this.props;
    const className = (chat.id === selectedChat) ? 'Chat-selected' : 'Chat';
    const lastMessageClassName = chat.last_message_is_read ? 'LastMessage' : 'LastMessage-unread';
    const messageTimestamp = getMessageTimestamp(new Date(chat.last_message_timestamp));

    return <div className={className} onClick={this.handleClick}>
      <div className="ChatInfo">
        <span>{chat.interlocutor_username}</span>
        <div className="LastMessageTimestamp">{messageTimestamp}</div>
      </div>
      <div className={lastMessageClassName}>
        {chat.is_interlocutor_typing ? <div className="LoadingDots">
                                         {chat.interlocutor_username} is typing
                                       </div> : chat.last_message}
      </div>
    </div>;
  }
});
