const Review = require('../models/review');
const axios = require('axios');
const API_KEY = process.env.TMDB_KEY;

module.exports.fetch = async function (req, res) {
    try {
        const data = await axios({
            url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
            method: "GET"
        });
        const movies = data.data.results;
        for (const movie of movies) {
            movie.overview = movie.overview.slice(0, 100) + '...';
        }
        return res.render('home', { msg: 'Trending Now...', movies: movies });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.search = async function (req, res) {
    try {
        const data = await axios({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${req.query.query}&page=1`,
            method: "GET"
        });
        const movies = data.data.results;
        for (const movie of movies) {
            movie.overview = movie.overview.slice(0, 100) + '...';
        }
        return res.render('home', { msg: `Search Results for ${req.query.query}`, movies: movies });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getMovie = async function (req, res) {
    try {
        const movie = await axios({
            url: `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`,
            method: "GET"
        });
        const credits = await axios({
            url: `https://api.themoviedb.org/3/movie/${req.params.id}/credits?api_key=${API_KEY}`,
            method: "GET"
        });
        Review.find({ movieId: req.params.id })
            .sort('-createdAt')
            .populate('userId', '-email -password -__v')
            .lean()
            .exec(function (err, reviews) {
                reviews.forEach(review => review.createdAt = new Date(review.createdAt).toDateString());
                return res.render('movie', { 
                    movie: movie.data, 
                    cast: credits.data.cast.slice(0, 12),
                    reviews: reviews,
                    helpers: {
                        equal: function (s1,s2) { return s1==s2; }
                    }
                });
            });
    }
    catch (err) {
        console.log(err);
    }
}