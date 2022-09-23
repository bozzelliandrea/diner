const _router = require('express').Router();

_router.post('/register', (req, res, next) => {
    res.send("Hello Register");
})

_router.post('/login', (req, res, next) => {
    res.send("Hello Login");
})

_router.get('/refresh', (req, res, next) => {
    res.send("Hello Refresh");
})

module.exports = _router