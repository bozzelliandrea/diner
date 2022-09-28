const request = require('supertest');
const express = require('express');
const {test_user} = require('./_auth-utils.test');
const core = require("core");
const jwt = require('jsonwebtoken');

const test_server = express();
test_server.use(express.json());
test_server.use(require("./_router"));
test_server.use(core.errorHandler)

describe('POST /register', function () {
    it('create a new user', async () => {
        await request(test_server)
            .post('/register')
            .send(test_user)
            .expect(core.httpCode.CREATED)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then(response => {
                expect(response.body).toHaveProperty("jwt");
                expect(response.body).toHaveProperty("payload");
                expect(response.body.payload).toHaveProperty("username");
                expect(response.body.payload.username).toBe(test_user.username);
                expect(response.body.jwt).not.toBeNull();
                expect(response.body.jwt).not.toBeUndefined();

                test_user.jwt = response.body.jwt;
            })
    });

    it('retry with the same user and should fail', async () => {
        await request(test_server)
            .post('/register')
            .send(test_user)
            .expect(core.httpCode.CONFLICT)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("User already exist");
            })
    });

    it('register a new user with username null', async () => {
        await request(test_server)
            .post('/register')
            .send({
                ...test_user,
                username: null
            })
            .expect(core.httpCode.BAD_REQUEST)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("Registration required parameter cannot be null");
            })
    });

    it('register a new user with email null', async () => {
        await request(test_server)
            .post('/register')
            .send({
                ...test_user,
                email: null
            })
            .expect(core.httpCode.BAD_REQUEST)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("Registration required parameter cannot be null");
            })
    });

    it('register a new user with password and email null', async () => {
        await request(test_server)
            .post('/register')
            .send({
                ...test_user,
                email: null,
                password: null
            })
            .expect(core.httpCode.BAD_REQUEST)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("Registration required parameter cannot be null");
            })
    });
});

describe('POST /login', function () {
    it('login with the registered user', async () => {
        await request(test_server)
            .post('/login')
            .send(test_user)
            .expect(core.httpCode.OK)
            .then(response => {
                expect(response.body).toHaveProperty("jwt");
                expect(response.body.jwt).not.toBeNull();
                expect(response.body.jwt).not.toBeUndefined();

                test_user.jwt = response.body.jwt;
            })
    });

    it('login with null password, should fail', async () => {
        await request(test_server)
            .post('/login')
            .send({
                ...test_user,
                password: null
            })
            .expect(core.httpCode.BAD_REQUEST)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("Login required parameter cannot be null");
                expect(response.body).not.toHaveProperty("jwt");
            })
    });

    it('login with fake user, should return unauthorized', async () => {
        await request(test_server)
            .post('/login')
            .send({
                ...test_user,
                username: 'imOneHacker'
            })
            .expect(core.httpCode.UNAUTHORIZED)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("The user does not exist");
                expect(response.body).not.toHaveProperty("jwt");
            })
    });

    it('login with wrong password, should return unauthorized and fail', async () => {
        await request(test_server)
            .post('/login')
            .send({
                ...test_user,
                password: 'theWrongPassword'
            })
            .expect(core.httpCode.UNAUTHORIZED)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("Wrong password");
                expect(response.body).not.toHaveProperty("jwt");
            })
    });
});

describe('GET /refresh', function () {
    it('refresh the token', async () => {
        await request(test_server)
            .get('/refresh')
            .set('Authorization', test_user.jwt)
            .expect(core.httpCode.OK)
            .then(response => {
                expect(response.body).toHaveProperty("jwt");
                expect(response.body.jwt).not.toBeNull();
                expect(response.body.jwt).not.toBeUndefined();

                jwt.verify(response.body.jwt, process.env.TOKEN_SECRET, {}, (error, decoded) => {
                    expect(decoded.username).toBe(test_user.username);
                    expect(decoded.role).toBe(test_user.role);
                });
            })
    });

    it('fail without jwt header', async () => {
        await request(test_server)
            .get('/refresh')
            .expect(core.httpCode.BAD_REQUEST)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe("Token not found");
            })
    });

    it('refresh token with fake jwt, should fail', async () => {
        await request(test_server)
            .get('/refresh')
            .set('Authorization', "Not3923819The87u8jnaiReal12u4uToken")
            .expect(core.httpCode.INTERNAL_SERVER_ERROR)
            .then(response => {
                expect(response.body).toHaveProperty("message");
            })
    });
});