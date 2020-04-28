var add = function(req, res){
    console.log("coffeeshop module's add called");
    // var paramName = req.body.name || req.query.name;
    var paramName = req.body.name;
    var paramAddress = req.body.address;
    var paramTel = req.body.tel || req.query.tel;
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    console.log('Request Parameter : ' + paramName + ', ' + paramAddress + ', ' +
                 paramTel + ', ' + paramLongitude + ',' + paramLatitude);
    var database = req.app.get('database');
    if(database.db){
        addCoffeeShop(database, paramName, paramAddress, paramTel, paramLongitude,
            paramLatitude, function(err, result){
                if(err){
                    console.error(err.stack);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Error for add coffee-shop</h2>');
                    res.write('<p>'+err.stack+'</p>');
                    res.end();
                    return;
                }
                if(result){
                    console.dir(result);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Success for add coffee-shop</h2>');
                    res.end();
                }else{
                    console.dir(result);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for add coffee-shop</h2>');
                    res.end();
                }
            })
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail Connect Database</h2>');
        res.end();
    }

};
module.exports.add = add;
var addCoffeeShop = function(database, name, address, tel, longitude, latitude, callback){
    console.log('addCoffeeShop called');
    var coffeeShop = database.CoffeeShopModel(
        {
            name:name,
            address:address,
            tel:tel,
            geometry:{
                type:'Point',
                coordinates: [longitude, latitude]
            }
        }
    );
    coffeeShop.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        console.log('coffeeShop Data added');
        callback(null, coffeeShop);
    });
};
var list = function(req, res){
    console.log("coffeeshop module's list called");
    var database = req.app.get('database');
    if(database.db){
        database.CoffeeShopModel.findAll(function(err, result){
            if(err){
                console.error('error for list');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Error for list</h2>');
                res.end();
                return;
            }
            if(result){
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Success for list</h2>');
                res.write('<div><ul>');
                for (var i = 0; i < result.length; i++) {
                    var curName = result[i]._doc.name;
                    var curAddress = result[i]._doc.address;
                    var curTel = result[i]._doc.tel;
                    var curLongitude = result[i]._doc.geometry.coordinates[0];
                    var curLatitude = result[i]._doc.geometry.coordinates[1];
                    res.write('<li># ' + i + ':' + curName + ', ' + curAddress + ',' + curTel
                                + ', ' + curLongitude + ',' + curLatitude + '</li>');
                }
                res.write('</ul></div>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Fail for list</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail to connect database</h2>');
        res.end();
    }
};
module.exports.list = list;
var findNear = function(req, res){
    console.log('coffeeshop findNear called');
    var maxDistance = 1000;
    var paramLongitude = req.body.longitude;
    var paramLatitude = req.body.latitude;
    console.log('Request Parameters : ' + paramLongitude + ', ' + paramLatitude);
    var database = req.app.get('database');
    if(database.db){
        database.CoffeeShopModel.findNear(paramLongitude, paramLatitude, maxDistance, function(err, results){
            if(err){
                console.log('Error at findNear');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Fail for findNear</h2>');
                res.write(err.stack);
                res.end();
                return;
            }
            if(results){
                console.dir(results);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Nearest CoffeeShop</h2>');
                res.write('<div><ul>')
                for (var i = 0; i < results.length; i++) {
                    var curName = results[i]._doc.name;
                    var curAddress = results[i]._doc.address;
                    var curTel = results[i]._doc.tel;
                    var curLongitude = results[i]._doc.geometry.coordinates[0];
                    var curLatitude = results[i]._doc.geometry.coordinates[1];
                    res.write('<li>#' + i + ': ' + curName + ', ' + curAddress + ','
                      + curTel + ', ' + curLongitude + ', ' + curLatitude + '</li>');
                }
                res.write('</ul></div>');
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Fail for list</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail for database connect</h2>');
        res.end();
    }
};
module.exports.findNear = findNear;
var findWithin = function(req, res){
    console.log('coffeeshop findWithin called');
    var paramTopLeftLongitude = req.body.top_left_longitude || req.query.top_left_longitude;
    var paramTopLeftLatitude = req.body.top_left_latitude || req.query.top_left_latitude;
    var paramBottomRightLongitude = req.body.bottom_right_longitude || req.query.bottom_right_longitude;
    var paramBottomRightLatitude = req.body.bottom_right_latitude || req.query.bottom_right_latitude;
    console.log('Request Parameters');
    console.log('top_left : [' + paramTopLeftLongitude + ', ' + paramTopLeftLatitude + ']');
    console.log('bottom_right : [' + paramBottomRightLongitude + ', ' + paramBottomRightLatitude + ']');
    var database = req.app.get('database');
    if(database.db){
        database.CoffeeShopModel.findWithin(paramTopLeftLongitude, paramTopLeftLatitude,
            paramBottomRightLongitude, paramBottomRightLatitude, function(err, results){
                if(err){
                    console.error(err.stack);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for Find</h2>');
                    res.write(err.stack);
                    res.end();
                    return;
                }
                if(results){
                    console.dir(results);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>CoffeeShop in Area</h2>');
                    res.write('<div><ul>')
                    for (var i = 0; i < results.length; i++) {
                        var curName = results[i]._doc.name;
                        var curAddress = results[i]._doc.address;
                        var curTel = results[i]._doc.tel;
                        var curLongitude = results[i]._doc.geometry.coordinates[0];
                        var curLatitude = results[i]._doc.geometry.coordinates[1];
                        res.write('<li>#' + i + ': ' + curName + ', ' + curAddress + ', ' + curTel
                                  + ',' + curLongitude + ',' + curLatitude + '</li>');
                    }
                    res.write('</ul></div>');
                }else{
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for Find</h2>');
                    res.end();
                }
            });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail for database connect</h2>');
        res.end();
    }
};
module.exports.findWithin = findWithin;
var findCircle = function(req, res){
    console.log('coffeeshop findCircle called');
    var paramCenterLongitude = req.body.center_longitude || req.query.center_longitude;
    var paramCenterLatitude = req.body.center_latitude || req.query.center_latitude;
    var paramRadius = req.body.radius || req.query.radius;
    console.log('Request Parameters : ' + paramCenterLongitude, ', ' + paramCenterLatitude + ',' + paramRadius)
    var database = req.app.get('database');
    if(database.db){
        database.CoffeeShopModel.findCircle(paramCenterLongitude, paramCenterLatitude, paramRadius,
            function(err, results){
                if(err){
                    console.error(err.stack);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for Find</h2>');
                    res.write(err.stack);
                    res.end();
                    return;
                }
                if(results){
                    console.dir(results);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>CoffeeShop in Circle</h2>');
                    res.write('<div><ul>')
                    for (var i = 0; i < results.length; i++) {
                        var curName = results[i]._doc.name;
                        var curAddress = results[i]._doc.address;
                        var curTel = results[i]._doc.tel;
                        var curLongitude = results[i]._doc.geometry.coordinates[0];
                        var curLatitude = results[i]._doc.geometry.coordinates[1];
                        res.write('<li>#' + i + ': ' + curName + ', ' + curAddress + ', ' + curTel
                            + ',' + curLongitude + ',' + curLatitude + '</li>');
                    }
                    res.write('</ul></div>');
                }else{
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for Find</h2>');
                    res.end();
                }
            });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail for connect db</h2>');
        res.end();
    }
};
module.exports.findCircle = findCircle;
var findNear2 = function(req, res){
    console.log('coffeeshop findNear called');
    var maxDistance = 1000;
    var paramLongitude = req.body.longitude;
    var paramLatitude = req.body.latitude;
    console.log('Request Parameters : ' + paramLongitude + ', ' + paramLatitude);
    var database = req.app.get('database');
    if(database.db){
        database.CoffeeShopModel.findNear(paramLongitude, paramLatitude, maxDistance, function(err, results){
            if(err){
                console.log('Error at findNear');
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Fail for findNear</h2>');
                res.write(err.stack);
                res.end();
                return;
            }
            if(results.length > 0){
                res.render('findnear.ejs', {result : results[0]._doc,
                    paramLatitude:paramLatitude,
                    paramLongitude:paramLongitude
                });
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>Fail for list</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail for database connect</h2>');
        res.end();
    }
};
module.exports.findNear2 = findNear2;
var findWithin2 = function(req, res){
    console.log('coffeeshop findWithin called');
    var paramLongitude = req.body.longitude || req.query.longitude;
    var paramLatitude = req.body.latitude || req.query.latitude;
    var paramTopLeftLongitude = req.body.top_left_longitude || req.query.top_left_longitude;
    var paramTopLeftLatitude = req.body.top_left_latitude || req.query.top_left_latitude;
    var paramBottomRightLongitude = req.body.bottom_right_longitude || req.query.bottom_right_longitude;
    var paramBottomRightLatitude = req.body.bottom_right_latitude || req.query.bottom_right_latitude;
    console.log('Request Parameters');
    console.log('top_left : [' + paramTopLeftLongitude + ', ' + paramTopLeftLatitude + ']');
    console.log('bottom_right : [' + paramBottomRightLongitude + ', ' + paramBottomRightLatitude + ']');
    var database = req.app.get('database');
    if(database.db){
        database.CoffeeShopModel.findWithin(paramTopLeftLongitude, paramTopLeftLatitude,
            paramBottomRightLongitude, paramBottomRightLatitude, function(err, results){
                if(err){
                    console.error(err.stack);
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for Find</h2>');
                    res.write(err.stack);
                    res.end();
                    return;
                }
                if(results.length > 0){
                    console.dir(results);
                    res.render('findwithin.ejs',{
                        result:results[0]._doc,
                        paramLatitude:paramLatitude,
                        paramLongitude:paramLongitude,
                        paramTopLeftLatitude:paramTopLeftLatitude,
                        paramTopLeftLongitude:paramTopLeftLongitude,
                        paramBottomRightLatitude:paramBottomRightLatitude,
                        paramBottomRightLongitude:paramBottomRightLongitude
                    });
                }else{
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>Fail for Find</h2>');
                    res.end();
                }
            });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Fail for database connect</h2>');
        res.end();
    }
};
module.exports.findWithin2 = findWithin2;