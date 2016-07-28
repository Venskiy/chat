import {getAllUsers} from 'utils/apiCalls';

export const initialFetchUsers = () => {
  return dispatch => {
    getAllUsers().then(users => {
      dispatch({ type: 'ADD_USERS', users });
    });
  };
};
