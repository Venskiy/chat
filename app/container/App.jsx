import React from 'react';

import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import UsersList from './UsersList';

export default () => {
  return <div className="Container">
    <ChatsList />
    <ChatWindow />
    <UsersList />
  </div>
}
