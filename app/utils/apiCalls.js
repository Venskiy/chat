export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:8000/chat/get_all_users', {
      method: 'get',
    }).then(response => {
      response.json().then(response => resolve(response.users));
    });
  });
};
