import React from 'react';
import {connect} from 'react-redux';
import {addChatMessage, updateChatLastMessage} from 'actions';

import MessagesBlock from 'components/MessagesBlock';
import MessageForm from 'components/MessageForm';

const ChatWindow = ({selectedChat, messages, onChatMessage}) => {
  if(Object.keys(selectedChat).length) {
    return <div className="ChatWindow">
      <MessagesBlock chatMessages={messages[selectedChat.chat_id]} />
      <MessageForm chat={selectedChat} onMessage={onChatMessage} />
    </div>
  }
  else {
    return <div className="ChatWindow-empty" />
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

const mapDispatchToProps = (dispatch) => ({
  onChatMessage(chatId, message) {
    dispatch(addChatMessage(chatId, message));
    dispatch(updateChatLastMessage(chatId, message));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
