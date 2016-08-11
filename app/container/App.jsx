import React from 'react';
import {connect} from 'react-redux';
import {addNewChatMessage, readChatMessage, changeIsTypingState, addNewChat} from 'actions';

import * as constants from 'utils/constants';
import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import UsersList from './UsersList';

const App = React.createClass({

  componentWillUpdate(nextProps) {
    if(nextProps.currentUser !== this.props.currentUser) {
      const {onNewChatMessage, onMessageRead, onInterlocutorTyping, onNewChat} = this.props;

      const ws = new WebSocket(`ws://127.0.0.1:8888/chat_app/${nextProps.currentUser.user_id}/`);

      ws.onmessage = function(e) {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case constants.SEND_MESSAGE:
            onNewChatMessage(data.chat_id, data.message);
            break;
          case constants.READ_MESSAGE:
            onMessageRead(data.chat_id);
            break;
          case constants.IS_USER_TYPING:
            onInterlocutorTyping(data.chat_id);
            break;
          case constants.DISPLAY_CHAT_ON_RECIPIENT_SIDE:
            onNewChat(data.chat);
            break;
          default:
            break;
        }
      };
    }
  },

  render() {
    return (
      <div className="Container">
        <ChatsList chats={this.props.chats} selectedChat={this.props.selectedChat} />
        <ChatWindow chats={this.props.chats} selectedChat={this.props.selectedChat} />
        <UsersList />
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  chats: state.chats,
  selectedChat: state.selectedChat,
});

const mapDispatchToProps = (dispatch) => ({
  onNewChatMessage(chatId, message) {
    dispatch(addNewChatMessage(chatId, message));
  },

  onMessageRead(chatId) {
    dispatch(readChatMessage(chatId));
  },

  onInterlocutorTyping(chatId) {
    dispatch(changeIsTypingState(chatId));
  },

  onNewChat(chat) {
    dispatch(addNewChat(chat));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
