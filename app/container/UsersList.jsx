import React from 'react';
import {connect} from 'react-redux';

import User from 'components/User'

const UserList = ({users}) => {
  return <div className="users-list">
    {users.map(user => {
      return <User username={user.username} key={user.username} />;
    })}
  </div>;
}

const mapStateToProps = (state) => ({
  users: state.users
});

export default connect(mapStateToProps)(UserList);
