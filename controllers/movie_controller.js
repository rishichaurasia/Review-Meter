const axios = require('axios');

module.exports.fetchMovies = async function (req, res) {
    try {
        const data = await axios({
            url: "https://api.themoviedb.org/3/trending/movie/week?api_key=d6d213e27bfb10d52d43288fb95ef788",
            method: "GET"
        });
        const movies = data.data.results;
        for(const movie of movies){
            movie.overview = movie.overview.slice(0,100) + '...';
        }
        return res.render('home', { msg: 'Trending Now...', movies: movies });
    }
    catch (err) {
        console.log(err);
    }
}