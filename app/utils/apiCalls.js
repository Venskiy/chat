import {getCookie} from 'utils/utils';

export const createChat = (username) => {
  return new Promise((resolve, reject) => {
    let headers = new Headers();
    headers.append('X-CSRFToken', getCookie('csrftoken'));
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    fetch('/api/create_chat', {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers,
      body: JSON.stringify({
        username: username
      })
    })
    .then(response => {
      response.json().then(response => resolve(response));
    });
  });
};


export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/get_authenticated_user', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(user => resolve(user));
    });
  });
};


export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/get_all_users', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(users => resolve(users));
    });
  });
};


export const getUserChats = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/get_user_chats', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(response => resolve(response));
    });
  });
};


export const loadChatMessages = (chatId, pageNumber) => {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:8000/chat/load_chat_messages/?page=${pageNumber}&chat_id=${chatId}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => {
      response.json().then(response => resolve(response));
    });
  });
}
