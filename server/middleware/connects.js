const { DBConnIns } = require("../config/dbconn")
const { CustomError } = require("../error/CustomError")


const connects = async (req, res, next) => {
    try {
        const connection = await DBConnIns.connect();
        req.connection = connection
        next();
    } catch (error) {
        throw new CustomError("Can't connect to Database!", 500)
    }
}

module.exports = {
    connects
}
