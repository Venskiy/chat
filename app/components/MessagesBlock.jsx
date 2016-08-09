import React from 'react';
import dateFormat from 'dateformat';
import ReactDOM from 'react-dom';

import {compareDatesWithoutTime} from 'utils/utils';
import ChatView from './ChatView';

let isLoading = false;

export default React.createClass({
  propTypes: {
    chatMessages: React.PropTypes.array.isRequired,
    chatId: React.PropTypes.string.isRequired,
    loadInfo: React.PropTypes.object.isRequired,
    onLoadMessages: React.PropTypes.func.isRequired
  },

  loadMessages() {
    const chatId = this.props.chatId;
    const onLoadMessages = this.props.onLoadMessages;

    return new Promise((resolve, reject) => {
      if(!isLoading) {
        isLoading = true;
        onLoadMessages(chatId);
        isLoading = false;
      }
      resolve();
    });
  },

  render () {
    const {chatMessages, chatId, loadInfo, onLoadMessages} = this.props;
    const messagesAmount = chatMessages.length;

    return <ChatView className="MessagesBlock"
                     flipped={true}
                     scrollLoadThreshold={0}
                     onInfiniteLoad={this.loadMessages}
                     loadingSpinnerDelegate={<div className="Loader">pow pow </div>}>
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
          {isFirstMessage ? <div className="MessagesBlockDate">{dateFormat(messageTimestamp, 'mmmm d, yyyy')}</div> : ''}
          <div className="MessageInfo">
            <div className="MessageSender">
              {message.sender__username}
            </div>
            <div className="MessageTimestamp">
              {dateFormat(messageTimestamp, 'h:MM:ss TT')}
            </div>
          </div>
          <div className="MessageText">{message.text}</div>
          {compareDatesWithoutTime(beforeMessageTimestamp, messageTimestamp) ? <div className="MessagesBlockDate">{dateFormat(beforeMessageTimestamp, 'mmmm d, yyyy')}</div> : ''}
        </div>
      })}
    </ChatView>
  }
});
