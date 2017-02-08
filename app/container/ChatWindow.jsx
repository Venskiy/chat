import React from 'react';
import {connect} from 'react-redux';
import {loadChatMessages} from 'actions';

import MessagesBlock from 'components/MessagesBlock';
import MessageForm from 'components/MessageForm';

const ChatWindow = ({chats, selectedChat, messages, chatMessagesLoadInfo, onChatMessagesLoad}) => {
  if(selectedChat && messages[selectedChat]) {
    return <div className="ChatWindow">
      <MessagesBlock chatMessages={messages[selectedChat]}
                     chatId={selectedChat.toString()}
                     loadInfo={chatMessagesLoadInfo[selectedChat]}
                     onLoadMessages={onChatMessagesLoad} />
      <MessageForm chat={chats[selectedChat]} />
    </div>
  }
  else {
    return <div className="ChatWindow-empty">Please, select a chat or create a new one!</div>
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages,
  chatMessagesLoadInfo: state.chatMessagesLoadInfo
});

const mapDispatchToProps = (dispatch) => ({
  onChatMessagesLoad(chatId) {
    dispatch(loadChatMessages(chatId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
