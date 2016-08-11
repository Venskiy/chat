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

export const getCookie = (c_name) => {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1)
    {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start,c_end));
    }
  }
  return '';
 }
