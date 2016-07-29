const initialState = {
  users: [],
  chats: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CHAT':
      let chats = Array.from(state.chats);
      chats.push(action.chat_id);
      return Object.assign({}, state, {chats: chats});
    case 'RECEIVE_USERS':
      return Object.assign({}, state, { users: action.users });
    case 'RECEIVE_CHATS':
      return Object.assign({}, state, { chats: action.chats });
    default:
      return state;
  }
}
