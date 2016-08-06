import React from 'react';
import {connect} from 'react-redux';
import {addNewChatMessage, readChatMessage, changeIsTypingState} from 'actions';

import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import UsersList from './UsersList';

const App = React.createClass({

  componentWillUpdate(nextProps) {
    if(nextProps.currentUser !== this.props.currentUser) {
      const {onNewChatMessage, onMessageRead, onInterlocutorTyping} = this.props;

      const ws = new WebSocket(`ws://127.0.0.1:8888/chat_app/${nextProps.currentUser.user_id}/`);

      ws.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if(data.type === 'SEND_MESSAGE') {
          onNewChatMessage(data.chat_id, data.message);
        }
        else if(data.type === 'READ_MESSAGE') {
          onMessageRead(data.chat_id);
        }
        else if(data.type === 'IS_USER_TYPING') {
          onInterlocutorTyping(data.chat_id);
        }
      };
    }
  },

  render() {
    return (
      <div className="Container">
        <ChatsList selectedChat={this.props.selectedChat} />
        <ChatWindow chats={this.props.chats}
                    selectedChat={this.props.selectedChat}
                    messages={this.props.messages} />
        <UsersList />
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  chats: state.chats,
  selectedChat: state.selectedChat,
  messages: state.messages
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
