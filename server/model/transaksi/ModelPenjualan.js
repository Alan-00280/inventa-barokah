class Penjualan {
    constructor(connection) {
        this.connection = connection
    }

    async all({date=null, id=null, margin=null}) {
        let query = ['SELECT * FROM penjualan_complete ', []]
        
        if (date) {
            if (!query[0].includes('WHERE')){query[0] += " WHERE "}
            else {query[0] += " AND "}
            query[0] += " DATE(waktu) = ? "
            query[1].push(date)
        }

        if (id) {
            if (!query[0].includes('WHERE')){query[0] += " WHERE "}
            else {query[0] += " AND "}
            query[0] += " idpenjualan = ? "
            query[1].push(id)
        }

        if (margin) {
            if (!query[0].includes('WHERE')){query[0] += " WHERE "}
            else {query[0] += " AND "}
            query[0] += " margin = ? "
            query[1].push(margin)
        }

        const [rows] = await this.connection.query(query[0], query[1])
        return rows
    }

    async detil({idpenjualan=null}) {
        let query = [ 'CALL getDetilPenjualanBarang(?) ' ,[]]
        if (idpenjualan) {
            query[1].push(idpenjualan)
            const [rows] = await this.connection.execute(query[0], query[1])
            return rows
        }
        return new Error('idpenjualan undefined!')
    }

    async createPenjualan({data={iduser: null}}) {
        const query = [' CALL insertPenjualan(?) ', []]
        if (data.iduser) {
            query[1].push(data.iduser)
            const [rows] = await this.connection.execute(query[0], query[1])
            return rows
        }
        return new Error('user id not defined!')
    }

    async insertDetilPenjualan({data={brg_id:'', jumlah:null}}) {
        const query = [ 'CALL insertDetailPenjualan(?, ?)', [] ]
        query[1].push(data.brg_id)
        query[1].push(data.jumlah)
        const [rows] = await this.connection.execute(query[0], query[1])
        return rows
    }

    async getMargin({all=true, id=null}) {
        const query = [' SELECT * FROM margin_penjualan_all ', []]

        if (!all || id) {
            query[0] += ' WHERE '
        }

        if (!all) {
            // if (id!==null) { query[0] += ' AND ' }
            query[0] += ' status = 1 '
        }

        if (id) {
            if (!all) { query[0] += ' AND ' }
            query[0] += ' idmargin_penjualan = ? '
            query[1].push(id)
        }

        const [rows] = await this.connection.execute(query[0], query[1]);
        return rows
    }

    async activateMargin({idMargin=null}) {
        const query = ['CALL activateMarginPenjualan(?)', []]

        if (idMargin) {
            query[1].push(idMargin)
        } else {
            return new Error('ID Margin cannot be Null')
        }

        const [rows] = await this.connection.execute(query[0], query[1]);
        return rows
    }

}

module.exports = {
    Penjualan
}
