import React from 'react';
import {connect} from 'react-redux';

import Chat from 'components/Chat';

const ChatList = ({chats}) => {
  return <div className="chats-list">
    {chats.map(chat => {
      return <Chat chatId={chat.id} key={chat.id} />
    })}
  </div>;
}

const mapStateToProps = (state) => ({
  chats: state.chats
});

export default connect(mapStateToProps)(ChatList);
