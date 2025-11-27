const { CustomError } = require('../error/CustomError');

const Router = require('express').Router();

Router.route('/')
    .get((req, res) => {
        try {
            const { DBConnIns } = require('../config/dbconn');
            res.json({
                success: true,
                msg: 'Connected to DB!!!'
            })
        } catch (error) {
            console.log(error);
            throw new CustomError(JSON.stringify(error), 500)
        }
    })

module.exports = Router
