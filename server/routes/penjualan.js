const Router = require('express').Router();
const { connects } = require('../middleware/connects');

const { 
    getMarginPenjualan,
    activateMarginPenjualan,
    createPenjualan,
    getPenjualanAll,
    getPenjualanDetil
 } = require('../controller/transaksi');

Router.route('/')
    .post(connects, createPenjualan)
    .get(connects, getPenjualanAll)

Router.route('/margin')
.get(connects, getMarginPenjualan)
    
Router.route('/margin-activate')
.post(connects, activateMarginPenjualan)

Router.route('/:id')
    .get(connects, getPenjualanDetil)
    
module.exports = Router
