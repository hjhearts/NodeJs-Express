var express = require('express');
var router = express.Router();
var userDAO = require('./user');
router.route('/process/login', userDAO.login);
router.route('/process/addUser', userDAO.add);
router.route('/process/listUser', userDAO.listUser);
module.exports = router;