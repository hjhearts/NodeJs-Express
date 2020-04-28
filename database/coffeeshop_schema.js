var Schema = {};
Schema.createSchemas = function(mongoose){
    var CoffeeShopSchema = new mongoose.Schema({
        name:{
            type:String,
            index:'hashed',
            'default':''
        },
        address:{
            type:String,
            'default':''
        },
        tel:{
            type:String,
            'default':''
        },
        geometry:{
            'type':{type:String, 'default':'Point'},
            coordinates:[{type:'Number'}]
        },
        created_at:{
            type:Date,
            index:{unique:false},
            'default':Date.now
        },
        updated_at:{
            type:Date,
            index:{unique:false},
            'default':Date.now
        }
    });
    CoffeeShopSchema.index({geometry:'2dsphere'});
    CoffeeShopSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });
    CoffeeShopSchema.static('findNear', function(longitude, latitude, maxDistance, callback){
        console.log('findNear called');
        this.find().where('geometry').near(
            {
                center:{
                    type:'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                maxDistance:maxDistance
            }).limit(1).exec(callback);
    });
    CoffeeShopSchema.static('findWithin', function(top_left_longitude, top_left_latitude,
                                                   bottom_right_longitude, bottom_right_latitude, callback){
        console.log('findWithin called');
        this.find().where('geometry').within(
            {
                box:[
                    [parseFloat(top_left_longitude), parseFloat(top_left_latitude)],
                    [parseFloat(bottom_right_longitude), parseFloat(bottom_right_latitude)]
                ]
            }).exec(callback);
    });
    CoffeeShopSchema.static('findCircle', function(center_longitude, center_latitude,
                                                   radius, callback){
        this.find().where('geometry').within(
            {
                center : [parseFloat(center_longitude), parseFloat(center_latitude)],
                radius : parseFloat((radius/6371000).toString()),
                unique : true,
                spherical : true
            }).exec(callback);
    });
    return CoffeeShopSchema;
};
module.exports = Schema;