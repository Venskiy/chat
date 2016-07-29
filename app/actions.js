import {createChat as _createChat, loadChatMessages as _loadChatMessages,
  getAllUsers, getUserChats} from 'utils/apiCalls';

export const selectChat = (chatId) => ({
  type: 'SELECT_CHAT',
  chatId
});

export const createChat = (username) => {
  return dispatch => {
    _createChat(username).then(chat_id => {
      dispatch({ type: 'ADD_CHAT', chat_id });
    });
  };
};

export const loadChatMessages = (chatId) => {
  return dispatch => {
    _loadChatMessages(chatId).then(chatMessages => {
      dispatch({ type: 'RECEIVE_CHAT_MESSAGES', chatMessages });
    });
  };
};

export const initialFetchUsers = () => {
  return dispatch => {
    getAllUsers().then(users => {
      dispatch({ type: 'RECEIVE_USERS', users });
    });
  };
};

export const initialFetchChats = () => {
  return dispatch => {
    getUserChats().then(chats => {
      dispatch({ type: 'RECEIVE_CHATS', chats});
    });
  };
};
