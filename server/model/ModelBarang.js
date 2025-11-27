const { CustomError } = require("../error/CustomError")

class Barang {
    constructor(connection) {
        this.connection = connection
    }

    async all() {
        const [rows] = await this.connection.query('SELECT * FROM barang')
        return [rows]
    }

    async allWithStok({all='false'}) {
        if (all == 'false') {
            const [rows] = await this.connection.query('SELECT * FROM barang_satuan_stokvu_barang_aktif')
            return [rows]
        } else {
            const [rows] = await this.connection.query('SELECT * FROM barang_satuan_stokvu ORDER BY status DESC')
            return [rows]
        }
    }

    async kartuStok({all='false'}) {
        let query = ['SELECT * FROM', []]

        if(all=='true'){
            query[0] += ' kartu_stok_join_barang '
        } else {
            query[0] += ' kartu_stok_join_barang_aktif '
        }

        query[0] += ' ORDER BY status_barang DESC, idkartu_stok'
        const [rows] = await this.connection.query(query[0], query[1])
        return rows
    }

    async allVendor({all='false'}) {
        if (all == 'false') {
            const [rows] = await this.connection.query('SELECT * FROM vendor_aktif')
            return [rows]
        } else {
            const [rows] = await this.connection.query('SELECT * FROM vendor ORDER BY status')
            return [rows]
        }
    }

    async getSatuan() {
        const [rows] = await this.connection.execute('SELECT * FROM satuan WHERE status = 1')
        return rows
    }

    async postBarang({nama='', idsatuan='', jenis='', harga=null}) {
        let query = ['INSERT INTO barang (nama, jenis, status, harga, idsatuan) VALUES (?, ?, ?, ?, ?)' , []]

        if (!nama || !idsatuan || !jenis || !harga) {
            throw new CustomError('data belum lengkap', 500)
        }

        query[1].push(nama)
        query[1].push(jenis)
        query[1].push('1')
        query[1].push(harga)
        query[1].push(idsatuan)

        const [res] = await this.connection.execute(query[0], query[1])
        return res
    }
}

module.exports = {
    Barang
}
