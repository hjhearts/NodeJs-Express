var LocalStrategy = require('passport-local').Strategy;
module.exports = new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done){
    var paramName = req.body.name || req.query.name;
    var database = req.app.get('database');
    database.UserModel.findOne({'email':email}, function(err, user){
        if(err) {return done(err);}
        if(user) {return done(err, false, req.flash('signMessage', 'Already Use Email'))}
        user = new database.UserModel({
            'email':email,
            'password':password,
            'name':paramName
        });
        user.save(function(err){
            if(err){return done(err);}
            return done(null, user);
        })
    })
});