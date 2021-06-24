const User = require('../models/user')
const bcrypt = require('bcryptjs');

module.exports.signup = function(req,res) {
    if(req.isAuthenticated())
        return res.redirect('/');
    return res.render('signup');
};

module.exports.createUser = async function(req, res) {
    if(req.body.password != req.body.confirmPassword)
        return res.redirect('back');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    
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