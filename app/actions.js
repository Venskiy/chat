import {createChat as _createChat, loadChatMessages as _loadChatMessages,
  getCurrentUser, getAllUsers, getUserChats} from 'utils/apiCalls';
import {waitForSocketConnection} from 'utils/utils';
import * as constants from 'utils/constants';
import * as actionTypes from 'utils/actionTypes';

export const selectChat = (chatId) => ({
  type: actionTypes.SELECT_CHAT,
  chatId
});

export const addNewChatMessage = (chatId, senderId, message) => ({
  type: actionTypes.ADD_NEW_CHAT_MESSAGE,
  chatId,
  senderId,
  message
});

export const readChatMessage = (chatId) => ({
  type: actionTypes.READ_CHAT_MESSAGE,
  chatId
});

export const changeIsTypingState = (chatId) => ({
  type: actionTypes.CHANGE_IS_TYPING_STATE,
  chatId
});

export const addNewChat = (chat) => ({
  type: actionTypes.ADD_NEW_CHAT,
  chat
});

export const initLoadChatMessagesInfo = (chatId) => ({
  type: actionTypes.INIT_LOAD_CHAT_MESSAGES_INFO,
  chatId
});

export const incrementChatMessagesPageNumber =  (chatId) => ({
  type: actionTypes.INCREMENT_CHAT_MESSAGE_PAGE_NUMBER,
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
        const chatId = chatInfo.chat.id;

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

export const loadChatMessages = (chatId, isInitialLoad) => {
  return (dispatch, getState) => {
    let currentPageNumber;
    if(getState().chatMessagesLoadInfo[chatId]) {
      if(isInitialLoad) {
        return;
      } else {
        currentPageNumber = getState().chatMessagesLoadInfo[chatId].pageNumber;
      }
    }
    else {
      currentPageNumber = 0
      dispatch(initLoadChatMessagesInfo(chatId));
    }

    _loadChatMessages(chatId, currentPageNumber + 1).then(response => {
      const chatMessages = response.chat_messages;
      const hasMore = response.has_more_chat_messages;

      dispatch({type: actionTypes.SET_HAS_MORE_CHAT_MESSAGES_VALUE, chatId, hasMore });
      dispatch({ type: actionTypes.RECEIVE_CHAT_MESSAGES, chatId, chatMessages });

      if(currentPageNumber) {
        dispatch(incrementChatMessagesPageNumber(chatId));
      }
    });
  };
};

export const initialFetchCurrentUser = () => {
  return dispatch => {
    getCurrentUser().then(user => {
      dispatch({ type: actionTypes.RECEIVE_CURRENT_USER, user });
    });
  };
};

export const initialFetchUsers = () => {
  return dispatch => {
    getAllUsers().then(users => {
      dispatch({ type: actionTypes.RECEIVE_USERS, users });
    });
  };
};

export const initialFetchChats = () => {
  return dispatch => {
    getUserChats().then(chats => {
      dispatch({ type: actionTypes.RECEIVE_CHATS, chats});
    });
  };
};
