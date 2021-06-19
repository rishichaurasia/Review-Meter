const mongoose = require('mongoose');

// Connect to db
const database = mongoose.connect('mongodb://localhost:27017/review-meter', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to db...');
});

module.exports = database;