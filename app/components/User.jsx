import React from 'react';

export default React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired,
    onChatCreate: React.PropTypes.func.isRequired
  },

  handleClick() {
    this.props.onChatCreate(this.props.username);
  },

  render () {
    const {username} = this.props;

    return <div className="User">
      <div>{username}</div>
      <button onClick={this.handleClick}>Start chat</button>
    </div>;
  }
});
