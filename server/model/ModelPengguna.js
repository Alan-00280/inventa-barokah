const { CustomError } = require("../error/CustomError")

class Pengguna {
    constructor(connection) {
        this.connection = connection
    }

    async all() {
        const [rows] = await this.connection.query('SELECT * FROM user')
        return [rows]
    }

    async allWithRole() {
        const [rows] = await this.connection.query('SELECT * FROM user_rolevu')
        return [rows]
    }

    async getRole() {
        const [rows] = await this.connection.execute('SELECT * FROM role')
        return rows
    }

    async postPengguna({nama='', idrole='', pass=''}) {
        let query = ['INSERT INTO user (username, password, idrole) VALUES (?, ?, ?)', []]

        if (!nama || !idrole || !pass) {
            throw new CustomError('Data belum lengkap', 500)
        }

        query[1].push(nama)
        query[1].push(pass)
        query[1].push(idrole)

        const [res] = await this.connection.execute(query[0], query[1])
        return res
    }
}

module.exports = {
    Pengguna
}
