const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect('mongodb://localhost:27017', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB online');

    }catch (error) {
        console.log(error);
        throw new Error('Database error');
    }
}

module.exports = {
    dbConnection
}