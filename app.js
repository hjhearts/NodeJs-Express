var express = require('express'),
    path = require('path');
var configPassport = require('./config/passport');
var userPassport= require('./routes/user-passport-route');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var partial = require('express-partials');
var config = require('./config/config');
var route_loader = require('./routes/route_loader');
var router = express.Router();
var database = require('./database/database');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
console.log('Using JSON-RPC at [' + jsonrpc_api_path + ']');
app.set('port', process.env.PORT || config.server_port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cors());
app.use(partial());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));
database.init(app, config);
route_loader.init(app, router);
// 라우터와 데이터베이스연결 및 호출 모듈화
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var handler_loader = require('./handlers/handler_loader');
var jayson = require('jayson');
var jsonrpc_api_path = config.jsonrpc_api_path || './api';
handler_loader.init(jayson, app, jsonrpc_api_path);
configPassport(app, passport);
userPassport(app, passport);
module.exports = app;