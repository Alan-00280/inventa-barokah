const Router = require('express').Router();
const { connects } = require('../middleware/connects');
const {
    getAllPengguna,
    allWithRole,
    getRole,
    postUser
} = require('../controller/main');

Router.route('/')
    .get(connects, getAllPengguna)

Router.route('/with-role')
    .get(connects, allWithRole)

Router.route('/role')
    .get(connects, getRole)
    .post(connects, postUser)

Router.route('/vendor')
    .get(connects, )

module.exports = Router
