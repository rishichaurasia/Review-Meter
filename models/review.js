const mongoose = require('mongoose');

const Review = mongoose.model('Review', new mongoose.Schema({
    movieId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, required: true }
}, {
    timestamps: true
}));

module.exports = Review;