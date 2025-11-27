const { CustomError } = require('./CustomError');

const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            err: {
                ...err,
                msg: err.message
            }
        })
    }

    return res.status(500).json({
        success: false, 
        msg: 'something went wrong',
        err: err
    })
}

module.exports = errorHandler;
