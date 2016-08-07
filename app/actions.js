import {createChat as _createChat, loadChatMessages as _loadChatMessages,
  getCurrentUser, getAllUsers, getUserChats} from 'utils/apiCalls';
import {waitForSocketConnection} from 'utils/utils';

export const selectChat = (chatId) => ({
  type: 'SELECT_CHAT',
  chatId
});

export const addNewChatMessage = (chatId, message) => ({
  type: 'ADD_NEW_CHAT_MESSAGE',
  chatId,
  message
});

export const readChatMessage = (chatId) => ({
  type: 'READ_CHAT_MESSAGE',
  chatId
});

export const changeIsTypingState = (chatId) => ({
  type: 'CHANGE_IS_TYPING_STATE',
  chatId
});

export const addNewChat = (chat) => ({
  type: 'ADD_NEW_CHAT',
  chat
});

export const createChat = (username) => {
  return dispatch => {
    _createChat(username).then(chatInfo => {
      if(chatInfo.type === 'CHAT_ALREADY_EXISTS') {
        const chatId = chatInfo.chat_id;

        dispatch(loadChatMessages(chatId));
        dispatch(selectedChat(chatId));
      }
      else if(chatInfo.type === 'CHAT_NEW') {
        const chatId = chatInfo.chat.chat_id;

        const ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${chatId}/`);
        waitForSocketConnection(ws, function() {
          ws.send(JSON.stringify({type: 'DISPLAY_CHAT_ON_RECIPIENT_SIDE', chat: chatInfo.chat}));
          ws.close();
        });

        dispatch(addNewChat(chatInfo.chat));
        dispatch(selectChat(chatId));
      }
    });
  };
};

export const loadChatMessages = (chatId) => {
  return dispatch => {
    _loadChatMessages(chatId).then(chatMessages => {
      dispatch({ type: 'RECEIVE_CHAT_MESSAGES', chatId, chatMessages });
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
