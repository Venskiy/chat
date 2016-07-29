import React from 'react';

export default React.createClass({
  propTypes: {
    chatId: React.PropTypes.string.isRequired,
  },

  render () {
    const {chatId} = this.props;

    return <div className="chat">
      {chatId}
    </div>
  }
});
