var echo = function(params, callback){
    console.log('JSON-RPC echo called');
    console.dir(params);
    callback(null, params);
};
module.exports = echo;