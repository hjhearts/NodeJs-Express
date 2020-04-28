
var config = require('../config/config');
var route_loader = {};
route_loader.init = function(app, router){
    console.log('router_route.init called');
    return initRoutes(app, router);
};
function initRoutes(app, router){
    var infoLen = config.route_info.length;
    console.log('routing module : ' + infoLen);
    for (var i = 0; i < infoLen; i++) {
        var curItem = config.route_info[i];
        var curModule = require(curItem.file);
        if(curItem.type === 'get'){
            console.log('=======get=======');
            router.route(curItem.path).get(curModule[curItem.method]);
        }else if(curItem.type === 'post'){
            console.log('========post=======');
            router.route(curItem.path).post(curModule[curItem.method]);
        }
        console.log('Routing module [%s] is Defined', curItem.method);
    }
    app.use('/', router);
}
module.exports = route_loader;
