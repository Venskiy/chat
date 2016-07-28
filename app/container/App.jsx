import React from 'react';

import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import UsersList from './UsersList';

export default () => {
  return <div className="container">
    <ChatsList />
    <ChatWindow />
    <UsersList />
  </div>
}
