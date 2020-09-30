const { io } = require('../index');

// Mensaje de sockets
io.on('connection', client => {
    console.log('Client connected!');

    client.on('disconnect', () => {
        console.log('Client disconnected');
    });
});