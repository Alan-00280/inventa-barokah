class Penerimaan {
    constructor(connection) {
        this.connection = connection
    }

    async getPenerimaanPDetilByPengadaanID({pengadaanID}) {
        let query = ['SELECT * FROM penerimaan p JOIN detail_penerimaan dp ON p.idpenerimaan = dp.idpenerimaan WHERE p.idpengadaan = ? ', [pengadaanID]]
        const [rows] = await this.connection.execute(query[0], query[1])
        return [rows]
    }

    async postPenerimaan(metadata) {
        let query = ['INSERT INTO penerimaan(idpengadaan, iduser) VALUES (?, ?)', [metadata.idpengadaan, metadata.iduser]]
        const [result1] = await this.connection.execute(query[0], query[1])
        let result2 = null

        if (metadata.pengadaanDone) {
            let query2 = ['UPDATE pengadaan SET status = "A" WHERE idpengadaan = ?', [metadata.idpengadaan]]
            const [runquery2] = await this.connection.execute(query2[0], query2[1])
            result2 = runquery2
        }

        return [result1, result2]
    }

    async postDetilPenerimaan({data, idpenerimaan}){
        let query = ['INSERT INTO detail_penerimaan(jumlah_terima, harga_satuan_terima, idpenerimaan, barang_idbarang) VALUES (?, ?, ?, ?)', [data.jumlah, data.harga_satuan, idpenerimaan, data.idbarang]]
        const [result] = await this.connection.execute(query[0], query[1])
        return result
    }

    async getPenerimaan({id=undefined, single=false}) {
        let query = ['', []]

        if (id) {
            query[0] = 'SELECT * FROM detail_penerimaan_barang_VU WHERE idpenerimaan = ? '
            query[1].push(id)
        } else {
            query[0] = 'SELECT * FROM penerimaan_user_VU '
        }

        if (id && single) {
            query[0] = 'SELECT * FROM penerimaan_user_VU WHERE idpenerimaan = ? '
        } else if (!id && single) {
            return new Error('ID nya kak?')
        }
        
        try {
            const [result] = await this.connection.execute(query[0], query[1])
            return result
        } catch (error) {
            return error
        }

    }
}

module.exports = {
    Penerimaan
}
