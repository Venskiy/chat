import {getAllUsers, createChat as _createChat} from 'utils/apiCalls';

export const initialFetchUsers = () => {
  return dispatch => {
    getAllUsers().then(users => {
      dispatch({ type: 'ADD_USERS', users });
    });
  };
};

export const createChat = (username) => {
  return dispatch => {
    _createChat(username).then(chat_id => {
      dispatch({ type: 'ADD_CHAT', chat_id });
    });
  };
};
