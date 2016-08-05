import React from 'react';

export default React.createClass({
  propTypes: {
    chatMessages: React.PropTypes.array
  },

  render () {
    const {chatMessages} = this.props;

    return <div className="MessagesBlock">
      {chatMessages.map((message, i) => {
        const className = message.is_read ? 'Message' : 'Message-unread';
        return <div className={className} key={`message${i}`}>{message.text}</div>
      })}
    </div>;
  }
});
