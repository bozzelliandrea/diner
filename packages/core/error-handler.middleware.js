module.exports = function (err, req, res, next) {
    console.error(err);

    res.status(err.code).send({
        code: err.code,
        message: err.message,
        description: err.description
    })
}
