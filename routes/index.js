var express = require('express');
var router = express.Router();

const User = require('./User');

const { auth } = require('./Auth');

/* test url */
router.get('/hello', (req, res)=>{
    res.send("hello world");
});

/* GET home page. */
router.post('/user/login', User.login);
router.post('/user/register', User.register);
router.get('/user/logout', auth, User.logout);

module.exports = router;


