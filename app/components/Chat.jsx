import React from 'react';

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

    return <div className={className} onClick={this.handleClick}>
      {chat.chat_id}
    </div>;
  }
});
