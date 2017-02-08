import * as actionTypes from 'utils/actionTypes';

const initialState = {
  currentUser: {},
  users: [{'username': 'first'}, {'username': 'second'}, {'username': 'third'}],
  chats: {},
  selectedChat: '',
  messages: {'2': [{'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'},
   {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'}, {'text': 'hello'} ]},
  chatMessagesLoadInfo: {}
};

export default function(state = initialState, action) {
  let chats;
  let messages;
  let chatMessages;
  let chatMessagesLoadInfo;
  switch (action.type) {
    case actionTypes.SELECT_CHAT:
      return Object.assign({}, state, {selectedChat: action.chatId});
    case actionTypes.ADD_NEW_CHAT_MESSAGE:
      messages = Object.assign({}, state.messages);
      chats = Object.assign({}, state.chats);
      chatMessagesLoadInfo = Object.assign({}, state.chatMessagesLoadInfo)
      if(messages[action.chatId]) {
        chatMessages = Array.from(state.messages[action.chatId]);
        if(chatMessages.length % 50 === 0) {
          chatMessages.pop();
          if(!chatMessagesLoadInfo[action.chatId].hasMore) {
            chatMessagesLoadInfo[action.chatId].hasMore = true;
          }
        }
        chatMessages.unshift({'text': action.message.text,
                              'sender_username': action.message.sender_username,
                              'timestamp': action.message.timestamp,
                              'is_read': false});
        messages[action.chatId] = chatMessages;
      }
      chats[action.chatId].last_message = action.message.text;
      chats[action.chatId].last_message_sender_id = action.message.sender_id;
      chats[action.chatId].last_message_timestamp = action.message.timestamp;
      chats[action.chatId].last_message_is_read = false;
      return Object.assign({}, state, { messages }, { chats }, { chatMessagesLoadInfo });
    case actionTypes.READ_CHAT_MESSAGE:
      messages = Object.assign({}, state.messages);
      if(messages[action.chatId]) {
        const length = messages[action.chatId].length
        for(let i = 0; i < length; ++i) {
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
    case actionTypes.CHANGE_IS_TYPING_STATE:
      chats = Object.assign({}, state.chats);
      if(chats[action.chatId].is_interlocutor_typing) {
        chats[action.chatId].is_interlocutor_typing = false;
      }
      else {
        chats[action.chatId].is_interlocutor_typing = true;
      }
      return Object.assign({}, state, { chats });
    case actionTypes.ADD_NEW_CHAT:
      chats = Object.assign({}, state.chats);
      messages = Object.assign({}, state.messages);
      chatMessagesLoadInfo = Object.assign({}, state.chatMessagesLoadInfo)
      chats[action.chat.id] = action.chat;
      chatMessages = [{'text': action.chat.last_message,
                       'sender_username': state.currentUser.username,
                       'timestamp': action.chat.last_message_timestamp,
                       'is_read': false}];
      messages[action.chat.id] = chatMessages;
      chatMessagesLoadInfo[action.chat.id] = {pageNumber: 1, hasMore: false};
      return Object.assign({}, state, { chats }, { messages }, { chatMessagesLoadInfo });
    case actionTypes.INIT_LOAD_CHAT_MESSAGES_INFO:
      chatMessagesLoadInfo = Object.assign({}, state.chatMessagesLoadInfo);
      chatMessagesLoadInfo[action.chatId] = {pageNumber: 1};
      return Object.assign({}, state, { chatMessagesLoadInfo });
    case actionTypes.INCREMENT_CHAT_MESSAGE_PAGE_NUMBER:
      chatMessagesLoadInfo = Object.assign({}, state.chatMessagesLoadInfo);
      chatMessagesLoadInfo[action.chatId].pageNumber += 1;
      return Object.assign({}, state, { chatMessagesLoadInfo });
    case actionTypes.SET_HAS_MORE_CHAT_MESSAGES_VALUE:
      chatMessagesLoadInfo = Object.assign({}, state.chatMessagesLoadInfo);
      chatMessagesLoadInfo[action.chatId].hasMore = action.hasMore;
      return Object.assign({}, state, { chatMessagesLoadInfo });
    case actionTypes.RECEIVE_CHAT_MESSAGES:
      messages = Object.assign({}, state.messages);
      if(messages[action.chatId]) {
        messages[action.chatId] = messages[action.chatId].concat(action.chatMessages);
      }
      else {
        messages[action.chatId] = action.chatMessages;
      }
      return Object.assign({}, state, { messages });
    case actionTypes.RECEIVE_CURRENT_USER:
      return Object.assign({}, state, { currentUser: action.user })
    case actionTypes.RECEIVE_USERS:
      return Object.assign({}, state, { users: action.users });
    case actionTypes.RECEIVE_CHATS:
      let chats = action.chats;
      if(Array.isArray(chats)) {
        chats = chats.reduce((result, item) => {
          result[item.id] = item;
          return result;
        }, {})
      }
      return Object.assign({}, state, { chats: chats });
    default:
      return state;
  }
}
