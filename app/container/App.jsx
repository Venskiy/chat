import React from 'react';
import {connect} from 'react-redux';

import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import UsersList from './UsersList';

const App = ({selectedChat}) => {
  return <div className="Container">
    <ChatsList selectedChat={selectedChat} />
    <ChatWindow selectedChat={selectedChat} />
    <UsersList />
  </div>
}

const mapStateToProps = (state) => ({
  selectedChat: state.selectedChat
});

export default connect(mapStateToProps)(App)
