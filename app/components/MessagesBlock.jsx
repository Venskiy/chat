import React from 'react';
import dateFormat from 'dateformat';

import {compareDatesWithoutTime} from 'utils/utils';

export default React.createClass({
  propTypes: {
    chatMessages: React.PropTypes.array
  },

  render () {
    const {chatMessages} = this.props;
    const messagesAmount = chatMessages.length;

    return <div className="MessagesBlock">
      {chatMessages.map((message, i) => {
        const className = message.is_read ? 'Message' : 'Message-unread';
        const messageTimestamp = new Date(message.timestamp);
        const isFirstMessage = i === (messagesAmount - 1);
        let beforeMessageTimestamp;


        if(i === 0) {
          beforeMessageTimestamp = new Date(chatMessages[i].timestamp);
        }
        else {
          beforeMessageTimestamp = new Date(chatMessages[i - 1].timestamp);
        }

        return <div className={className} key={`message${i}`}>
          <div className="MessagesBlockDate">
            {isFirstMessage ? dateFormat(messageTimestamp, 'mmmm d, yyyy') : ''}
          </div>
          <div>{message.sender__username}{dateFormat(messageTimestamp, 'h:MM:ss TT')}</div>
          <div>{message.text}</div>
          <div className="MessagesBlockDate">
            {compareDatesWithoutTime(beforeMessageTimestamp, messageTimestamp) ? dateFormat(beforeMessageTimestamp, 'mmmm d, yyyy') : ''}
          </div>
        </div>
      })}
    </div>;
  }
});
