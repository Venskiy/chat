import dateFormat from 'dateformat';

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

export const getMessageTimestamp = (date) => {
  const currentDate = new Date();

  if(currentDate.getYear() !== date.getYear()) {
    return dateFormat(date, 'mmm d yyyy');
  }
  else if(currentDate.getDate() === date.getDate()) {
    return dateFormat(date, 'h:MM TT');
  }
  else if((currentDate.getDate() - 1) === date.getDate())
    return 'yesterday';
  else {
    return dateFormat(date, 'mmm d');
  }
}
