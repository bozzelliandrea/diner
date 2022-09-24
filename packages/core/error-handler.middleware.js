module.exports = function (err, req, res, next) {
    console.error(err);

    res.status(err.code || 500).send({
        code: err.code || 500,
        message: err.message || 'Internal Server Error',
        description: err.description
    })
}
