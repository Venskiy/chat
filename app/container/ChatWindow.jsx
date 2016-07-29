import React from 'react';
import {connect} from 'react-redux';

import Messages from 'components/Messages';

const ChatWindow = ({selectedChat, messages}) => {
  return <div className="ChatWindow">
    <Messages chatMessages={messages[selectedChat]} />
  </div>
}

const mapStateToProps = (state) => ({
  messages: state.messages
});

export default connect(mapStateToProps)(ChatWindow);
