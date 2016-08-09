import React from 'react';
import dateFormat from 'dateformat';
import ReactDOM from 'react-dom';

import {compareDatesWithoutTime} from 'utils/utils';

export default React.createClass({
  propTypes: {
    chatMessages: React.PropTypes.array.isRequired,
    chatId: React.PropTypes.string.isRequired,
    loadInfo: React.PropTypes.object.isRequired,
    onStartLoad: React.PropTypes.func.isRequired,
    onLoadMessages: React.PropTypes.func.isRequired
  },

  handleScroll() {
    const el = ReactDOM.findDOMNode(this.refs.test);
    console.log(el.scrollTop);
    if(el.scrollTop === 0) {
      if(!this.props.loadInfo.isLoading) {
        this.props.onStartLoad(this.props.chatId);
        this.props.onLoadMessages(this.props.chatId);
      }
    }
  },

  render () {
    const {chatMessages, chatId, loadInfo} = this.props;
    const messagesAmount = chatMessages.length;

    return <div className="MessagesBlock" ref="test" onScroll={this.handleScroll}>
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
          {loadInfo.isLoading ? <div>loading</div> : <div></div>}
        </div>
      })}
    </div>;
  }
});
