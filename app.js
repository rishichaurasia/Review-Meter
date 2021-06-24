require('dotenv').config();
const express = require('express')
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
// used for session cookie 
const session = require('express-session');
const passport = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const userController = require('./controllers/users_controller');
const movieController = require('./controllers/movie_controller');
const reviewController = require('./controllers/review_controller');
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static('public'));
var hbs = exphbs.create({
    helpers: {
        ifequal: function(arg1, arg2, options) {
            return (String(arg1) == String(arg2)) ? options.fn(this) : options.inverse(this);
        }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({
    name: 'token',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB_PATH
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// movie routes
app.get('/', movieController.fetch);
app.get('/movies/search', movieController.search);
app.get('/movies/:id', movieController.getMovie);

// reviews routes
app.post('/reviews', passport.checkAuthentication, reviewController.postReview);
app.delete('/review/:id', reviewController.deleteReview);

// user routes
app.get('/users/sign-up', userController.signup);
app.post('/users/createUser', userController.createUser);
app.post('/users/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/'}
), userController.createSession);
app.get('/users/sign-out', userController.destroySession);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})