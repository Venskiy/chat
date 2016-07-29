import React from 'react';
import {connect} from 'react-redux';
import {createChat} from 'actions';

import User from 'components/User'

const UserList = ({users, onChatCreate}) => {
  return <div className="UsersList">
    {users.map(user => {
      return <User username={user.username} onChatCreate={onChatCreate} key={user.username} />;
    })}
  </div>;
}

const mapStateToProps = (state) => ({
  users: state.users
});

const mapDispatchToProps = (dispatch) => ({
  onChatCreate(username) {
    dispatch(createChat(username));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
