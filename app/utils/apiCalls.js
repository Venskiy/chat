export const createChat = (username) => {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:8000/chat/create_chat/?username=${username}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(response => resolve(response.chat_id));
    });
  });
};


export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:8000/chat/get_all_users', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(response => resolve(response.users));
    });
  });
};


export const getUserChats = () => {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:8000/chat/get_user_chats', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(response => resolve(response.chats));
    });
  });
};


export const loadChatMessages = (chatId) => {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:8000/chat/load_chat_messages/?chat_id=${chatId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(response => resolve(response.chat_messages));
    });
  });
}
