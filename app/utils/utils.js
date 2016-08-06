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


export const compareDatesWithoutTime = (date1, date2) => {
  date1.setHours(0, 0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0, 0);

  return date1 > date2;
}
