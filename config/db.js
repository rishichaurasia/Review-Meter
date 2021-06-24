const mongoose = require('mongoose');

// Connect to db
const database = mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to db...');
});

module.exports = database;