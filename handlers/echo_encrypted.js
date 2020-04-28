var crypto = require('crypto-js');
var echo = function(params, callback){
    console.log('JSON-RPC echo_encrypted called');
    console.dir(params);
    try{
        var encrypted = params[0];
        var secret = 'my secret';
        var decrypted = crypto.AES.decrypt(encrypted , secret).toString(crypto.enc.Utf8);
        console.log('복호화 데이터 :' + decrypted);

        encrypted = '' + crypto.AES.encrypt(decrypted, '-> Server', secret);
        console.log(encrypted);
        params[0] = encrypted;
    }catch(err){
        console.log(err.stack);
    }
    callback(null, params);
};
module.exports = echo;