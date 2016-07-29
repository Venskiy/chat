const initialState = {
  users: [],
  chats: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'ADD_USERS':
      return Object.assign({}, state, { users: action.users });
    case 'ADD_CHAT':
      chats = Array.from(state.chats);
      chats.push(action.chat_id);
      return Object.assign({}, state, {chats: chats});
    default:
      return state;
  }
}
