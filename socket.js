var Config = require('./config.js');
var Assembler = require('./models/assembler.js');

module.exports = function (sockets) {
  return function (socket) {
    publicIO(socket, sockets);
  }
};

// Socket events for any user
function publicIO(socket, sockets) {

  // Assemble event from client
  socket.on('disassemble', function (output) {
    Assembler.disassemble(output, function (err, assembly) {
      if (err) console.warn(err);
      socket.emit('disassemble', {err: err, assembly: assembly});
    });
  });

}
