const User = require('../models/user')

module.exports.signup = function(req,res) {
    if(req.isAuthenticated())
        return res.redirect('/');
    return res.render('signup');
};

module.exports.createUser = function(req, res) {
    if(req.body.password != req.body.confirmPassword)
        return res.redirect('back');
    
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            console.log('error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body, (err, user) => {
                if(err){
                    console.log('error in creating user in signing up');
                    return;
                }

                return res.redirect('/');
            });
        }else{
            return res.redirect('back');
        }
    })
}

module.exports.createSession = function(req, res) {
    return res.redirect('back');
}

module.exports.destroySession = function(req,res) {
    req.logout();
    res.redirect('back');
}