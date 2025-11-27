const Router = require('express').Router();
const { connects } = require('../middleware/connects');

const {
    getPengadaan,
    getPengadaanDetil,
    createPengadaan,
    deletePengadaan
} = require('../controller/transaksi');

Router.route('/')
    .get(connects, getPengadaan)
    .post(connects, getPengadaanDetil)

Router.route('/create')
    .post(connects, createPengadaan)

Router.route('/:id')
    .delete(connects, deletePengadaan)

module.exports = Router
