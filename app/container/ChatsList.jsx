import React from 'react';
import {connect} from 'react-redux';
import {selectChat, loadChatMessages} from 'actions';

import Chat from 'components/Chat';

const ChatList = ({chats, selectedChat, onChatSelect}) => {
  return <div className="ChatList">
    {Object.keys(chats).sort((key1, key2) => {
      if(chats[key1].last_message_timestamp > chats[key2].last_message_timestamp) {
        return -1;
      }
      else if(chats[key1].last_message_timestamp < chats[key2].last_message_timestamp) {
        return +1;
      }
      else return 0;
    }).map(key => {
      return <Chat chat={chats[key]}
                   selectedChat={selectedChat.toString()}
                   onSelect={onChatSelect}
                   key={key} />
    })}
  </div>;
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  onChatSelect(chatId) {
    dispatch(loadChatMessages(chatId));
    dispatch(selectChat(chatId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
