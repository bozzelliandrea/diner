const express = require('express');
const core = require('./packages/core');

const server = express();

server.use(express.json())
server.use('/auth', require('./packages/auth/index').router)
server.use(core.errorHandler)
server.listen(3000, () => {
    console.log("Diner Server Ready -> http://localhost:3000")
})