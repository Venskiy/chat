var ws = new WebSocket("ws://127.0.0.1:8000/ws");

ws.onmessage = function (e) {
  $('#msg-block').append(
    e.data
  );
};

$('#msg-send').click(function(){
  ws.send($('#msg-input').val());
  $('#msg-input').val('');
});
