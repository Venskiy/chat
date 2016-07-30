const initialState = {
  users: [{'username': 'first'}, {'username': 'second'}, {'username': 'third'}],
  chats: [{'id': '1'}, {'id': '2'}, {'id': '3'}],
  selectedChat: '',
  messages: {'2': [{'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'},
   {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'},
    {'text': 'hello'}, {'text': 'hello'}, ]}
};

export default function(state = initialState, action) {
  let messages;
  switch (action.type) {
    case 'SELECT_CHAT':
      return Object.assign({}, state, {selectedChat: action.chatId.toString()});
    case 'ADD_CHAT_MESSAGE':
      const chatMessages = Array.from(state.messages[action.chatId]);
      chatMessages.push({'text': action.message});
      messages = Object.assign({}, state.messages);
      messages[action.chatId] = chatMessages;
      return Object.assign({}, state, { messages: messages });
    case 'ADD_CHAT':
      let chats = Array.from(state.chats);
      chats.push(action.chat_id);
      return Object.assign({}, state, {chats: chats});
    case 'RECEIVE_CHAT_MESSAGES':
      messages = Object.assign({}, state.messages);
      messages[state.selectedChat] = action.chatMessages;
      return Object.assign({}, state, { messages });
    case 'RECEIVE_USERS':
      return Object.assign({}, state, { users: action.users });
    case 'RECEIVE_CHATS':
      return Object.assign({}, state, { chats: action.chats });
    default:
      return state;
  }
}
