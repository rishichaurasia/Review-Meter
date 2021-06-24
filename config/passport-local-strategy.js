const passport = require('passport');
const bcrypt = require('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        // passwordField: 'password'
    },
    function(email, password, done){
        User.findOne({email: email}, async (err, user) => {
            if(err) {
                console.log('Error in finding user');
                return done(err);
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if(!user || !validPassword){
                console.log('Invalid email or password');
                return done(null, false);
            }
            
            return done(null, user);
        })
    }
));

// serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user) {
        if(err) {
            console.log('Error in finding user');
            return done(err);
        }
        return done(null, user);
    });
})

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/');
};

passport.setAuthenticatedUser = function(req,res,next) {
    if(req.isAuthenticated()){
        res.locals.user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email  
        };
    }
    next();
}

module.exports = passport;