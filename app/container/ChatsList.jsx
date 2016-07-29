import React from 'react';
import {connect} from 'react-redux';
import {selectChat, loadChatMessages} from 'actions';

import Chat from 'components/Chat';

const ChatList = ({chats, selectedChat, onChatSelect}) => {
  return <div className="ChatList">
    {chats.map(chat => {
      return <Chat chatId={chat.id} selectedChat={selectedChat} onSelect={onChatSelect} key={chat.id} />
    })}
  </div>;
}

const mapStateToProps = (state) => ({
  chats: state.chats,
  selectedChat: state.selectedChat
});

const mapDispatchToProps = (dispatch) => ({
  onChatSelect(chatId) {
    dispatch(selectChat(chatId));
    dispatch(loadChatMessages(chatId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
