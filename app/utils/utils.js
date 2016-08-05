export const waitForSocketConnection = (socket, callback) => {
  setTimeout(
    function() {
      if(socket.readyState === 1) {
        if(callback !== undefined){
          callback();
        }
        return;
      } else {
        waitForSocketConnection(socket,callback);
      }
    }, 5);
}
