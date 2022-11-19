const _router = require('express').Router();
const { Category,
        getById,
        find,
        deleteById,
        create,
        update
    } = require('./_category');

_router.route('/')
    .get((req, res, next) => {
        res.status(501).send("Not Implemented!")
    })
    .post((req, res, next) => {
        create(new Category(req.body))
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
    })
    .put((req, res, next) => {
        update(new Category(req.body))
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
    })

_router.route('/:id')
    .get((req, res, next) => {
        getById(req.params.id)
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
    })
    .delete((req, res, next) => {
        deleteById(req.params.id)
        .then(r => res.status(r.code).send(r))
        .catch(err => next(err))
    })

module.exports = _router;