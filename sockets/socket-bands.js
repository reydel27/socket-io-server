const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands;

bands.addBand( new Band( 'Rey Chavez' ));
bands.addBand( new Band( 'Gente de Zona' ));
bands.addBand( new Band( 'El Micha' ));
bands.addBand( new Band( 'Jacob Forever' ));



// Mensaje de sockets
io.on('connection', client => {
    console.log('Client connected!');
    client.emit('active-bands', bands.getBands() );



    client.on('disconnect', () => {
        console.log('Client disconnected');
    });

    client.on('message', (payload) => {
        console.log('Message received', payload);

        io.emit('message', { server: 'new message'});
    });

    client.on('send-message', (payload) => {
        console.log( payload );
        client.broadcast.emit('send-message', payload);
    });
    // Crear nueva banda
    client.on('add-band', (payload) => {
        const newBand = new Band( payload.name );
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands());
    });
    // gestion de votos
    client.on('votes', (payload) => {
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands());
    });

    client.on('new-message', ( payload ) => {
        // io.emit('new-message', payload ); // emite a todos incluido el que lo emite
        client.broadcast.emit('new-message', payload); // emite a todo menos al emisor
    });


});