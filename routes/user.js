var login = function(req, res){
    console.log('/process/login called');
    var paramId = req.param('id');
    var paramPwd = req.param('password');
    if(database){
        authUser(database, paramId, paramPwd, function(err, docs){
            if(err) throw err;
            if(docs){
                console.dir(docs);
                var userName = docs[0].name;
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>Login Success!</h1>');
                res.write('<div><p>User ID : ' + paramId + '</p></div>');
                res.write('<div><p>User Name : ' + userName + '</p></div>');
                res.write('<a href="/login.html">Re-Login</a>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>Login Fail!</h1>');
                res.write('<div><p>Check your id & pwd</p></div>');
                res.write('<a href="/login.html">Re-Login</a>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>Database Connection Fail</h1>');
        res.write('<div><p>Check your id & pwd</p></div>');
        res.end();
    }
};
var add = function(req, res){
    console.log('/process/addUser called');
    var addId = req.param('id');
    var addPass = req.param('password');
    var addName = req.param('name');
    if(database) {
        addUser(database, addId, addPass, addName, function (err, result) {
            if (err) {
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.end(err);
            }
            if(result){
                console.dir(result);
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>User add Success</h2>');
                res.write('<div><a href="/login.html">Login Page</a>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>User add Fail</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Database Connection Fail</h2>');
        res.end();
    }
};
var listUser = function(req, res){
    console.log('/process/listUser called');
    var database = req.app.get('database');
    if(database) {
        database.UserModel.findAll(function (err, results) {
            if (err) {
                console.log('error detected : ' + err.stack);
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>Error at findAll for User</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            if (results) {
                console.dir(results);
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>User List</h2>');
                res.write('<div><ul>');
                for (var i = 0; i < results.length; i++) {
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write('<li>#' + i + ' : ID:' + curId + ' NAME:' + curName + '</li>');
                }
                res.write('</ul></div>');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>Fail to Search User List</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Database Connection Fail</h2>');
        res.end();
    }

};
var addUser = function(database, id, password, name, callback){
    console.log('addUser called');
    var user = new UserModel({'id':id, 'password':password, 'name':name});
    user.save(function(err){
        if(err){
            console.log('error at save');
            callback(err, null);
            return;
        }
        console.log('addUser complete!');
        callback(null, user);
    });
};

var authUser = function(database, id, password, callback){
    console.log('authUser called');
    if(database){
        UserModel.findById(id, function(err, results){
            if(err) throw err;
            if(results.length > 0){
                console.log('Find User equals ID');
                var user = new UserModel({id:id});
                var authenticated = user.authenticate(password, results[0]._doc.salt,
                    results[0]._doc.hashed_password);
                if(authenticated){
                    console.log('password correct');
                    callback(null, results);
                }else{
                    console.log('password not correct');
                    callback(null, null);
                }
            }else{
                console.log('Cannot Find equalsId');
                callback(null, null);
            }
        })
    }
};
module.exports.login = login;
module.exports.add = add;
module.exports.listUser = listUser;