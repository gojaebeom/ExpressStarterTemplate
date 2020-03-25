var express = require('express');
var page_router = express.Router();
var api_router = express.Router();

const {login , register} = require('./user');


/* page router */
page_router.get('/', function home(req, res) {
    res.render('index', {
        session: req.session
    });
});

page_router.get('/login', function login(req, res) {
    res.render('login', {
        session: req.session
    })
})

page_router.get('/register', function register(req, res) {
    res.render('register', {
        session: req.session
    })
})


api_router.post('/user/login', login);



module.exports = {
    api_router,
    page_router
};