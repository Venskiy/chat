const initialState = {
  currentUser: {},
  users: [{'username': 'first'}, {'username': 'second'}, {'username': 'third'}],
  chats: {},
  selectedChat: {},
  messages: {'2': [{'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'},
   {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'} ]}
};

export default function(state = initialState, action) {
  let chats;
  let messages;
  switch (action.type) {
    case 'SELECT_CHAT':
      return Object.assign({}, state, {selectedChat: action.chat});
    case 'ADD_CHAT_MESSAGE':
      const chatMessages = Array.from(state.messages[action.chatId]);
      chatMessages.unshift({'text': action.message});
      messages = Object.assign({}, state.messages);
      messages[action.chatId] = chatMessages;
      return Object.assign({}, state, { messages: messages });
    case 'UPDATE_CHAT_LAST_MESSAGE':
      chats = Object.assign({}, state.chats);
      chats[action.chatId].last_message = action.message;
      return  Object.assign({}, state, { chats });
    case 'ADD_CHAT':
      chats = Array.from(state.chats);
      chats.push(action.chat_id);
      return Object.assign({}, state, {chats: chats});
    case 'RECEIVE_CHAT_MESSAGES':
      messages = Object.assign({}, state.messages);
      messages[state.selectedChat.chat_id] = action.chatMessages;
      return Object.assign({}, state, { messages });
    case 'RECEIVE_CURRENT_USER':
      return Object.assign({}, state, { currentUser: action.user })
    case 'RECEIVE_USERS':
      return Object.assign({}, state, { users: action.users });
    case 'RECEIVE_CHATS':
      return Object.assign({}, state, { chats: action.chats });
    default:
      return state;
  }
}
