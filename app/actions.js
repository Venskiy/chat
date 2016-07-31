import {createChat as _createChat, loadChatMessages as _loadChatMessages,
  getCurrentUser, getAllUsers, getUserChats} from 'utils/apiCalls';

export const selectChat = (chatId) => ({
  type: 'SELECT_CHAT',
  chatId
});

export const addChatMessage = (chatId, message) => ({
  type: 'ADD_CHAT_MESSAGE',
  chatId,
  message
});

export const createChat = (username) => {
  return dispatch => {
    _createChat(username).then(chatId => {
      dispatch({ type: 'ADD_CHAT', chatId });
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

export const initialFetchCurrentUser = () => {
  return dispatch => {
    getCurrentUser().then(user => {
      dispatch({ type: 'RECEIVE_CURRENT_USER', user });
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
