const _router = require('express').Router();
const {register, refresh, login} = require('./_auth');

_router.post('/register', (req, res, next) => {
    register(req.body.username, req.body.email, req.body.password)
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
})

_router.post('/login', (req, res, next) => {
    login(req.body.username, req.body.password)
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
})

_router.get('/refresh', (req, res, next) => {
    refresh(req.headers['authorization'])
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
})

module.exports = _router