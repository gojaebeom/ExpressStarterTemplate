var express = require('express');
var router = express.Router();

const { auth } = require('../controllers/AuthController');
const {login, register, logout} = require('../controllers/UserController');


/* test url */
router.get('/hello', (req, res)=>{
    res.send("hello world");
});

/* rest full API 통신. */
router.post('/user/login', login);
router.post('/user/register', register);
router.get('/user/logout', auth, logout);

module.exports = router;


