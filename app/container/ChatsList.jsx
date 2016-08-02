import React from 'react';
import {connect} from 'react-redux';
import {selectChat, loadChatMessages} from 'actions';

import Chat from 'components/Chat';

const ChatList = ({chats, selectedChat, onChatSelect}) => {
  return <div className="ChatList">
    {chats.map(chat => {
      return <Chat chatId={chat.chat_id.toString()} selectedChat={selectedChat} onSelect={onChatSelect} key={chat.chat_id} />
    })}
  </div>;
}

const mapStateToProps = (state) => ({
  chats: state.chats
});

const mapDispatchToProps = (dispatch) => ({
  onChatSelect(chatId) {
    dispatch(selectChat(chatId));
    dispatch(loadChatMessages(chatId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
