import React from 'react';

export default React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired
  },

  render () {
    return <div className="user">
      <div>{this.props.username}</div>
      <button>Start chat</button>
    </div>
  }
});
