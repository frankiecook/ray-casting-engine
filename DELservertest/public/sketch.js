var socket;

function setup() {
  socket = io.connect('http://localhost:3000');
  socket.on('mouse',newDrawing);
}

function newDrawing(data) {
  console.log("SENT&RECEIVED");
}

function mouseDragged() {
  console.log('Sending: ' + mouseX + ',' + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('mouse', data);
}
