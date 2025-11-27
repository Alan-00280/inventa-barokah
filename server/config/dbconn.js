const mysql2 = require('mysql2/promise')
require('dotenv').config()

class DBConnection {
    constructor({host='localhost', user='root', password='', database=''}) {
        this.host = host
        this.user = user
        this.password = password
        this.database = database
    }

    async connect() {
        try {
            return mysql2.createConnection({
                host: this.host,
                user: this.user,
                password: this.password,
                database: this.database
            })
        } catch (error) {
            throw new Error("Can't Connect to Database");
        }
    }
}

const DBConnIns = new DBConnection({
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE 
})

module.exports = {
    DBConnection,
    DBConnIns
}
