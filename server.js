const express = require('express');
const app = express();

const server = app.listen(process.env.PORT || 3000, listen);

function listen() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

const io = require('socket.io')(server);

io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);
        socket.on('mouse',
            function (data) {
                console.log("Received: 'mouse' " + data.x + " " + data.y);
                socket.broadcast.emit('mouse', data);
            }
        );

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);