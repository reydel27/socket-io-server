const express = require('express');
const path = require('path');

const app = express();

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público
const publicPath = path.resolve(__dirname, 'public_html');

app.use( express.static( publicPath ));


server.listen( 3000, ( err ) => {
    if( err ) throw new Error(err);

    console.log('Server running on port', 3000);
});