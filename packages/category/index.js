/**
 * Public API for auth module.
 */
module.exports = {
    router: require('./_router'),
    models: {
        Category: require('./_category').Category
    }
}