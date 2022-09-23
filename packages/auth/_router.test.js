const request = require('supertest');
const express = require('express');

const test_server = express();
test_server.use(express.json());
test_server.use(require("./_router"));

describe('POST /register', function() {
    it('TODO - responds with hello register', function(done) {
        request(test_server)
            .post('/register')
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .then(response => {
                expect(response).toHaveProperty("text");
                expect(response.text).toBe("Hello Register");
                done();
            })
    });
});

describe('POST /login', function() {
    it('TODO - responds with hello login ', function(done) {
        request(test_server)
            .post('/login')
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .then(response => {
                expect(response).toHaveProperty("text");
                expect(response.text).toBe("Hello Login");
                done();
            })
    });
});

describe('GET /refresh', function() {
    it('TODO - responds with hello login ', function(done) {
        request(test_server)
            .get('/refresh')
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .then(response => {
                expect(response).toHaveProperty("text");
                expect(response.text).toBe("Hello Refresh");
                done();
            })
    });
});