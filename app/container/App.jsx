import React from 'react';
import {connect} from 'react-redux';
import {addChatMessage} from 'actions';

import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import UsersList from './UsersList';

const App = React.createClass({
  shouldComponentUpdate(nextProps) {
    return Object.keys(nextProps.currentUser).length;
  },

  componentWillUpdate(nextProps) {
    const ws = new WebSocket(`ws://127.0.0.1:8888/chat_app/${nextProps.currentUser.user_id}/`);

    ws.onmessage = function(e) {
      console.log(e.data);
    };
  },

  render() {
    return (
      <div className="Container">
        <ChatsList selectedChat={this.props.selectedChat} />
        <ChatWindow selectedChat={this.props.selectedChat} />
        <UsersList />
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  selectedChat: state.selectedChat,
  messages: state.messages
});

const mapDispatchToProps = (dispatch) => ({
  onChatMessage(chatId, message) {
    dispatch(addChatMessage(chatId, message));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
