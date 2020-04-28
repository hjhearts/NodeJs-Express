var crypto = require('crypto');
var Schema = {};
Schema.createSchemas = function(mongoose){
    var UserSchema = mongoose.Schema({
        email:{
            type:String,
            required:true,
            unique:true,
            'default':''
        },
        hashed_password:{
            type:String,
            required:true,
            'default':''
        },
        salt:{
            type:String,
            required:true
        },
        name:{
            type:String,
            index:'hashed',
            'default':''
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
        },

    });
    UserSchema.virtual('password').set(function(password){
        this._password = password;
        this.salt = this.makeSalt;
        this.hashed_password = this.encryptPassword(password);
    }).get(function(){
        return this._password;
    });
    UserSchema.static('findByEmail', function(email, callback){
        return this.find({email:email}, callback);
    });
    UserSchema.statics.findAll = function(callback){
        return this.find({}, callback);
    };
    UserSchema.method('makeSalt', function(){
        return crypto.randomBytes(16).toString('hex');
    });
    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        }else{
            return this.encryptPassword(plainText) === hashed_password;
        }
    });
    UserSchema.path('email').validate(function(email){
        return email.length;
    }, 'no value at email');
    UserSchema.path('hashed_password').validate(function(hashed_password){
        return hashed_password.length;
    }, 'no value at hashed_password');
    console.log('UserSchema defined');
    return UserSchema;
};
module.exports = Schema;