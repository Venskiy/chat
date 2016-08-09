import React from 'react';
import {connect} from 'react-redux';
import {startLoadChatMessages, loadChatMessages} from 'actions';

import MessagesBlock from 'components/MessagesBlock';
import MessageForm from 'components/MessageForm';

const ChatWindow = ({chats, selectedChat, messages, chatMessagesLoadInfo, onStartLoad, onChatMessagesLoad}) => {
  if(selectedChat && messages[selectedChat]) {
    return <div className="ChatWindow">
      <MessagesBlock chatMessages={messages[selectedChat]}
                     chatId={selectedChat}
                     loadInfo={chatMessagesLoadInfo}
                     onStartLoad={onStartLoad}
                     onLoadMessages={onChatMessagesLoad} />
      <MessageForm chat={chats[selectedChat]} />
    </div>
  }
  else {
    return <div className="ChatWindow-empty" />
  }
}

const mapStateToProps = (state) => ({
  chatMessagesLoadInfo: state.chatMessagesLoadInfo
});

const mapDispatchToProps = (dispatch) => ({
  onStartLoad(chatId) {
    dispatch(startLoadChatMessages(chatId));
  },

  onChatMessagesLoad(chatId) {
    dispatch(loadChatMessages(chatId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
