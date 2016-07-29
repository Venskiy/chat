import React from 'react';

export default React.createClass({
  propTypes: {
    chatId: React.PropTypes.string.isRequired,
    selectedChat: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  handleClick() {
    this.props.onSelect(this.props.chatId);
  },

  render () {
    const {chatId, selectedChat} = this.props;
    const className = (chatId === selectedChat) ? 'Chat-selected' : 'Chat';

    return <div className={className} onClick={this.handleClick}>
      {chatId}
    </div>;
  }
});
