const express = require('express')
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
// used for session cookie 
const session = require('express-session');
const passport = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const userController = require('./controllers/users_controller');
const port = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
    name: 'token',
    secret: 'thisissecret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/review-meter'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.get('/', (req, res) => {
    return res.render('home', { msg: 'Handlebars are Cool!' });
})

// app.post('/users/sign-in', (req,res) => {
    
// })

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