import {createChat as _createChat, loadChatMessages as _loadChatMessages,
  getCurrentUser, getAllUsers, getUserChats} from 'utils/apiCalls';
import {waitForSocketConnection} from 'utils/utils';
import * as constants from 'utils/constants';

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

export const initLoadChatMessagesInfo = (chatId) => ({
  type: 'INIT_LOAD_CHAT_MESSAGES_INFO',
  chatId
});

export const incrementChatMessagesPageNumber =  (chatId) => ({
  type: 'INCREMENT_CHAT_MESSAGE_PAGE_NUMBER',
  chatId
});

export const createChat = (username) => {
  return dispatch => {
    _createChat(username).then(chatInfo => {
      if(chatInfo.type === constants.CHAT_ALREADY_EXISTS) {
        const chatId = chatInfo.chat_id;

        dispatch(loadChatMessages(chatId));
        dispatch(selectChat(chatId));
      }
      else if(chatInfo.type === constants.CHAT_NEW) {
        const chatId = chatInfo.chat.chat_id;

        const ws = new WebSocket(`ws://127.0.0.1:8888/tornado_chat/${chatId}/`);
        waitForSocketConnection(ws, function() {
          ws.send(JSON.stringify({type: constants.DISPLAY_CHAT_ON_RECIPIENT_SIDE,
                                  chat: chatInfo.chat}));
          ws.close();
        });

        dispatch(addNewChat(chatInfo.chat));
        dispatch(selectChat(chatId));
      }
    });
  };
};

export const loadChatMessages = (chatId) => {
  return (dispatch, getState) => {
    let currentPageNumber;
    if(getState().chatMessagesLoadInfo[chatId]) {
      currentPageNumber = getState().chatMessagesLoadInfo[chatId].pageNumber;
    }
    else {
      currentPageNumber = 0
      dispatch(initLoadChatMessagesInfo(chatId));
    }

    _loadChatMessages(chatId, currentPageNumber + 1).then(response => {
      const chatMessages = response.chat_messages;
      const hasMore = response.has_more_chat_messages;

      dispatch({type: 'SET_HAS_MORE_CHAT_MESSAGES_VALUE', chatId, hasMore });
      dispatch({ type: 'RECEIVE_CHAT_MESSAGES', chatId, chatMessages });

      if(currentPageNumber) {
        dispatch(incrementChatMessagesPageNumber(chatId));
      }
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
