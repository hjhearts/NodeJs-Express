var local_login = require('./passport/local-login');
var local_signUp = require('./passport/local-signup');
module.exports = function(app, passport){
    console.log('/config/passport called');
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(user, done){
        done(null, user);
    });
    passport.use('local-login', local_login);
    passport.use('local-signUp', local_signUp);
};