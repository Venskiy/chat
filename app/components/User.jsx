import React from 'react';

export default React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired,
    onChatCreate: React.PropTypes.func.isRequired
  },

  handleClick(username) {
    this.props.onChatCreate(username);
  },

  render () {
    const {username} = this.props;

    return <div className="user">
      <div>{username}</div>
      <button onClick={this.handleClick.bind(this, username)}>Start chat</button>
    </div>
  }
});
