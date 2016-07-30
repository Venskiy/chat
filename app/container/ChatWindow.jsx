import React from 'react';
import {connect} from 'react-redux';

import MessagesBlock from 'components/MessagesBlock';
import MessageForm from 'components/MessageForm';

const ChatWindow = ({selectedChat, messages}) => {
  if(selectedChat) {
    return <div className="ChatWindow">
      <MessagesBlock chatMessages={messages[selectedChat]} />
      <MessageForm chatId={selectedChat}/>
    </div>
  }
  else {
    return <div className="ChatWindow-empty" />
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(ChatWindow);
