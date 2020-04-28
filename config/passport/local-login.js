var LocalStrategy = require('passport-local').Strategy;
module.exports = new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done){
    console.log('passport/login called');
    var database = req.app.get('database');
    database.UserModel.findOne({'email':email}, function(err, user){
        if(err){return done(err)};
        if(!user){return done(null, false, req.flash('loginMessage',
            'No Account'))
        }
        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(!authenticated){
            console.log('Invalid password');
            return done(null, false, req.flash('loginMessage', 'Invalid password'));
        }
        console.log('Id Pwd Correct');
        return done(null, user);
    });
});
