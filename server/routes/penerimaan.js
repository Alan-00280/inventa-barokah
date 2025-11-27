const Router = require('express').Router();
const { connects } = require('../middleware/connects');

const {
    createPenerimaan,
    getPenerimaanPengadaanDetilID,
    getPenerimaan
} = require('../controller/transaksi');

Router.route('/')
    .post(connects, createPenerimaan)
    .get(connects, getPenerimaan)

Router.route('/detil-by-pengadaan')
    .get(connects, getPenerimaanPengadaanDetilID)

module.exports = Router
