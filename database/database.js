var mongoose = require('mongoose');
var database = {};
database.init = function(app, config){
    console.log('database.init() called');
    connect(app, config);
};
function connect(app, config){
    mongoose.connect(config.dbURL.toString());
    database = mongoose.connection;
    database.on('open', function(){
        console.log('database open');
        createSchema(app, config);
    });
    database.on('error', function(){
        console.error.bind(console.error, 'fail to connect mongodb')
    });
    database.on('disconnect', connect);
}
var curSchema;
var curModel;
function createSchema(app, config){
    var schemaLen = config.db_schemas.length;
    console.log(schemaLen);
    for (var i = 0; i < schemaLen; i++) {
        var curItem = config.db_schemas[i];
        console.log(curItem.file);
        curSchema = require(curItem.file).createSchemas(mongoose);
        console.log('Schema define at module : ' + curItem.file);
        curModel = mongoose.model(curItem.collection, curSchema);
        console.log('Model define at module : ' + curItem.collection);
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
    }
    app.set('database', database);
}
module.exports = database;