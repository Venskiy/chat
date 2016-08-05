import React from 'react';
import {connect} from 'react-redux';

import MessagesBlock from 'components/MessagesBlock';
import MessageForm from 'components/MessageForm';

const ChatWindow = ({chats, selectedChat, messages}) => {
  if(selectedChat && messages[selectedChat]) {
    return <div className="ChatWindow">
      <MessagesBlock chatMessages={messages[selectedChat]} />
      <MessageForm chat={chats[selectedChat]} />
    </div>
  }
  else {
    return <div className="ChatWindow-empty" />
  }
}

export default ChatWindow;
