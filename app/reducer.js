const initialState = {
  currentUser: {},
  users: [{'username': 'first'}, {'username': 'second'}, {'username': 'third'}],
  chats: {},
  selectedChat: '',
  messages: {'2': [{'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'},
   {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'} ]}
};

export default function(state = initialState, action) {
  let chats;
  let messages;
  switch (action.type) {
    case 'SELECT_CHAT':
      return Object.assign({}, state, {selectedChat: action.chatId});
    case 'ADD_NEW_CHAT_MESSAGE':
      messages = Object.assign({}, state.messages);
      if(messages[action.chatId]) {
        const chatMessages = Array.from(state.messages[action.chatId]);
        chatMessages.unshift({'text': action.message.text, 'timestamp': action.message.timestamp, 'is_read': false});
        messages[action.chatId] = chatMessages;
      }
      chats = Object.assign({}, state.chats);
      chats[action.chatId].last_message = action.message.text;
      chats[action.chatId].last_message_sender_id = action.message.sender_id;
      chats[action.chatId].last_message_timestamp = action.message.timestamp;
      chats[action.chatId].last_message_is_read = false;
      return Object.assign({}, state, { messages }, { chats });
    case 'READ_CHAT_MESSAGE':
      messages = Object.assign({}, state.messages);
      if(messages[action.chatId]) {
        for(let i = 0; i < messages[action.chatId].length; ++i) {
          if(messages[action.chatId][i].is_read) {
            break;
          }
          else {
            messages[action.chatId][i].is_read = true;
          }
        }
      }
      chats = Object.assign({}, state.chats);
      chats[action.chatId].last_message_is_read = true;
      return Object.assign({}, state, { messages }, { chats });
    case 'ADD_CHAT':
      chats = Array.from(state.chats);
      chats.push(action.chat_id);
      return Object.assign({}, state, {chats: chats});
    case 'RECEIVE_CHAT_MESSAGES':
      messages = Object.assign({}, state.messages);
      messages[action.chatId] = action.chatMessages;
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
