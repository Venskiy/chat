import React from 'react';
import {connect} from 'react-redux';

import MessagesBlock from 'components/MessagesBlock';
import MessageForm from 'components/MessageForm';

const ChatWindow = ({selectedChat, messages}) => {
  return <div className="ChatWindow">
    <MessagesBlock chatMessages={messages[selectedChat]} />
    <MessageForm />
  </div>
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(ChatWindow);
