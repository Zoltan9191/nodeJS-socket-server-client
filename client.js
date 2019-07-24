//client.js
var ioClient = require('socket.io-client');

var io = ioClient.connect('http://localhost:3000/', { reconnect: true });

// Add a connect listener
io.on('connect', function (socket) {
    console.log('Connected!');

    var a = 0;

    setInterval(function () {
        if (a == 0) {
            io.send('Msg')
            a = 1;
        }
        else {
            io.emit('json', 'user1', `{"color": "red", "query": "some dev"}`);
            a = 0;
        }
    }, 2000);
});

