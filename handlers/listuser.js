var listuser = function(params, callback){
    console.log('JSON-RPC listuser called');
    console.dir(params);
    var app = require('../app');
    var database = app.get('database');
    if(database){
        console.log('make reference database');
    }else{
        console.log('fail to make reference database');
        callback({
            code:410,
            message:'cannot to make reference database'
        }, null);
        return;
    }
    if(database.db){
        database.UserModel.findAll(function(err, results){
            console.dir(results);
            if(results){
                console.log('result data : ' + results.length);
                var output = [];
                for (var i = 0; i < results.length; i++) {
                    var curId = results[i]._doc.email;
                    var curName = results[i]._doc.name;
                    output.push({email:curId, name:curName});
                }
                callback(null, output);
            }
        });
    }
};
module.exports = listuser;