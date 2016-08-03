import React from 'react';
import {connect} from 'react-redux';
import {selectChat, loadChatMessages} from 'actions';

import Chat from 'components/Chat';

const ChatList = ({chats, selectedChat, onChatSelect}) => {
  return <div className="ChatList">
    {Object.keys(chats).map(key => {
      return <Chat chat={chats[key]} selectedChat={selectedChat} onSelect={onChatSelect} key={key} />
    })}
  </div>;
}

const mapStateToProps = (state) => ({
  chats: state.chats
});

const mapDispatchToProps = (dispatch) => ({
  onChatSelect(chat) {
    dispatch(selectChat(chat));
    dispatch(loadChatMessages(chat.chat_id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
