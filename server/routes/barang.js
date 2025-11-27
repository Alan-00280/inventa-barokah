const Router = require('express').Router()

const {
    getBarangStok,
    getVendor,
    getJenisBarang,
    postBarang
} = require('../controller/main')
const { connects } = require('../middleware/connects')
const {
    getKartuStok
} = require('../controller/transaksi')

Router.route('/')
    .post(connects, postBarang)

Router.route('/satuan')
    .get(connects, getJenisBarang)

Router.route('/with-stok')
    .get(connects, getBarangStok)

Router.route('/kartu-stok')
    .get(connects, getKartuStok)

Router.route('/vendor')
    .get(connects, getVendor)

module.exports = Router
