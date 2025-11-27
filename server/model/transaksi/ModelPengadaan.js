const { CustomError } = require("../../error/CustomError")

class Pengadaan {
    constructor(connection) {
        this.connection = connection
    }

    async all({all='false', date=null, id=null, detil='false'}) {
        let query = ['SELECT * FROM ', []]

        if (all=='true'){
            query[0] += ' pengadaan '
        } else if (all=='false' && detil=='false') {
            query[0] += ' Pengadaan_Barang_unconfirmed '
        } else if (detil=='true') {
            query[0] += ' pengadaan_detail '
        }

        if (date) {
            if (!query[0].includes('WHERE')){query[0] += " WHERE "}
            else {query[0] += " AND "}
            query[0] += " DATE(timestamp) = ? "
            query[1].push(date)
        }

        if (id) {
            if (!query[0].includes('WHERE')){query[0] += " WHERE "}
            else {query[0] += " AND "}
            query[0] += " idpengadaan = ? "
            query[1].push(id)
            const [rows] = await this.connection.query(query[0], query[1])
            return rows[0]
        }
         
        query[0] += " ORDER BY status DESC"
        const [rows] = await this.connection.query(query[0], query[1])
        return rows
    }

    async detilID({idPengadaan, barang=''}) {
        let query = ['SELECT * FROM detail_pengadaan WHERE idpengadaan = ?', [Number(idPengadaan)]]

        if (barang=='true'){
            query = ['CALL getDetilPengadaanBarang(?)', [Number(idPengadaan)]]
        }

        const [rows] = await this.connection.query(query[0], query[1])
        if (barang=='true'){return [rows[0]]}
        return [rows]
    }

    async postPengadaan({user_id, vendor_id}) {
        let query = ['CALL insertIntoPengadaan(?, ?)', [user_id, vendor_id]]
        const [res] = await this.connection.execute(query[0], query[1])
        return res
    }

    async postDetilPengadaan({data}) {
        let query = ['CALL insertDetailPengadaan(?, ?)', [data.brg_id, data.jumlah]]
        const [res] = await this.connection.execute(query[0], query[1])
        return res
    }
    
    async deleteDetilPengadaan({id}) {
        let query = [ 'CALL deletePengadaan(?)', [] ]

        if (!id) {
            throw new CustomError('id pengadaan undefined', 500)
        }

        query[1].push(id)
        const [res] = await this.connection.execute(query[0], query[1]);
        return res
    }

}

module.exports = {
    Pengadaan
}