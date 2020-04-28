module.exports = function(app, passport){
    app.get('/', function(req, res) {
        console.log('/ route called');
        res.render('index.ejs');
    });
    app.get('/login',function(req, res){
        console.log('/login called');
        res.render('login.ejs', {message:req.flash('loginMessage')});
    });
    app.post('/login',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash:true
    }));
    app.get('/signUp',function(req, res){
        console.log('/signUp called');
        res.render('signUp.ejs', {message:req.flash('signMessage')});
    });
    app.post('/signUp',passport.authenticate('local-signUp',{
        successRedirect : '/profile',
        failureRedirect : '/signUp',
        failureFlash : true
    }));
    app.get('/profile',function(req, res){
        if(!req.user){
            console.log('req.user is undefined');
            res.redirect('/');
        }else{
            if(Array.isArray(req.user)){
                res.render('profile.ejs', {user:req.user[0]._doc});
            }else{
                res.render('profile.ejs', {user:req.user});
            }
        }
    });
    app.get('/logout',function(req, res){
        req.logout();
        res.redirect('/');
    });
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email',
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect:'/profile',
        failureRedirect:'/'
    }));
};