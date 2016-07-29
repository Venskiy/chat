import React from 'react';

export default React.createClass({
  propTypes: {
    chatMessages: React.PropTypes.array
  },

  render () {
    const {chatMessages} = this.props;

    if(chatMessages) {
      return <div className="MessagesBlock">
        {chatMessages.map(message => {
          return <div className="Message">{message.text}</div>
        })}
      </div>;
    }
    else {
       return <div className="MessagesBlock">
         There is no messages
       </div>
    }
  }
});
