const express = require('express');
const path = require('path');

// DB Config
const { dbConnection } = require('./database/config');
dbConnection();

// App Express
const app = express();

// Read and parse body
app.use( express.json());

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path público
const publicPath = path.resolve(__dirname, 'public_html');
app.use( express.static( publicPath ));

// Routes
app.use( '/api/auth', require('./routes/auth'));


server.listen( 3000, ( err ) => {
    if( err ) throw new Error(err);

    console.log('Server running on port', 3000);
});