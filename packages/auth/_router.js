const _router = require('express').Router();
const {register} = require('./_auth');

_router.post('/register', (req, res, next) => {
    register(req.body.username, req.body.email, req.body.password)
        .then(r => res.send(r))
        .catch(err => next(err))
})

_router.post('/login', (req, res, next) => {
    res.send("Hello Login");
})

_router.get('/refresh', (req, res, next) => {
    res.send("Hello Refresh");
})

module.exports = _router