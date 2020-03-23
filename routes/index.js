var express = require('express');
var router = express.Router();

const { login, register, logout, info } = require('../controllers/UserController');

/* restful API 통신. */
router.post('/api/user/login', login);
router.post('/api/user/register', register);
router.get('/api/user/logout', logout);
router.get('/api/user/auth', info);



/****************************************************/

/* page router */
router.get('/', (req, res)=>{
    res.render("index",{session:req.session});
});
router.get('/login', (req, res)=>{
    res.render("LoginPage",{session:req.session});
});
router.get('/register', (req, res)=>{
    res.render("RegisterPage",{session:req.session});
});



module.exports = router;