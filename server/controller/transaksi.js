const { CustomError } = require("../error/CustomError");
const { Barang } = require("../model/ModelBarang");
const { Penerimaan } = require("../model/transaksi/ModelPenerimaan");
const { Pengadaan } = require("../model/transaksi/ModelPengadaan");
const { Penjualan } = require("../model/transaksi/ModelPenjualan");


//? Pengadaan ?//
const getPengadaan = async (req, res) => {
    const connection = req.connection
    const PengadaanIns = new Pengadaan(connection);

    const { all, date, id, detil } = req.query

    try {
        const pengadaanAll = await PengadaanIns.all({all: all,  date:date, id:id, detil: detil})
        
        res.status(200).json({
            pengadaan: pengadaanAll
        })

    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getPengadaanDetil = async (req, res) => {
    const connection = req.connection
    const PengadaanIns = new Pengadaan(connection);

    const { id, barang } = req.body

    try {
        const detilPengadaan = await PengadaanIns.detilID({idPengadaan: id, barang: barang})
        
        res.status(200).json({
            detailPengadaan: detilPengadaan
        })

    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getPenerimaanPengadaanDetilID = async (req, res) => {
    const connection = req.connection
    const PenerimaanIns = new Penerimaan(connection)

    const { idPengadaan } = req.query
    
    try {
        let result = undefined;

        if (idPengadaan){
            result = await PenerimaanIns.getPenerimaanPDetilByPengadaanID({pengadaanID: idPengadaan})
        }

        res.status(200).json({
            success: 'true',
            results: result
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const createPengadaan = async (req, res) => {
    const connection = req.connection
    const PengadaanIns = new Pengadaan(connection);

    const {user_id, vendor_id, items} = req.body
    const metadata = {user_id, vendor_id}
    const body = items

    // console.log(body);
    // console.log("================")
    // console.log(metadata)
    // return res.json({hi: true});

    try {
        const postPengadaan = await PengadaanIns.postPengadaan(metadata);

        for (const data of body) {
            await PengadaanIns.postDetilPengadaan({
                data
            });
        }

        res.status(201).json({
            success: 'true'
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const deletePengadaan = async (req, res) => {
    const connection = req.connection
    const PengadaanIns = new Pengadaan(connection);

    const { id } = req.params

    try {

        // return res.json({
        //     testing: 'It is just Testing',
        //     success: true,
        //     body: id
        // })

        const deletePengadaan = await PengadaanIns.deleteDetilPengadaan({id:  id})
        return res.json({
            success: true,
            response: deletePengadaan
        })

    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

//? Penerimaan ?//
const getPenerimaan = async (req, res) => {
    const connection = req.connection
    const PenerimaanIns = new Penerimaan(connection);

    //? Request Data ?//
    const { id } = req.query || {}

    let detilPenerimaan = undefined
    let getPenerimaan = undefined
    try {
        if (id) {
            getPenerimaan = await PenerimaanIns.getPenerimaan({id: id, single: true});
            detilPenerimaan = await PenerimaanIns.getPenerimaan({id: id});}
        else {
            getPenerimaan = await PenerimaanIns.getPenerimaan({});
        }

        res.status(201).json({
            success: 'true',
            response: {
                penerimaan: getPenerimaan,
                detilPenerimaan: detilPenerimaan || 'null'
            }
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getKartuStok = async (req, res) => {
    const connection = req.connection
    const barangIns = new Barang(connection)

    const { all } = req.query

    try {
        const result = await barangIns.kartuStok({all: all})
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const createPenerimaan = async (req, res) => {
    const connection = req.connection
    const PenerimaanIns = new Penerimaan(connection);

    const {iduser, idvendor, idpengadaan, pengadaanDone, ...others} = req.body
    const metadata = {iduser, idvendor, idpengadaan, pengadaanDone}
    const body = Object.values(others)

    let __jumlah_penerimaan_count_check = 0
    body.forEach(item=>__jumlah_penerimaan_count_check += item.jumlah)

    // console.log(body);
    // console.log("================")
    // console.log(metadata)

    try {
        if (__jumlah_penerimaan_count_check <= 0) {throw new CustomError('Penerimaan Masih Kosong', 500)}
        const postPenerimaan = await PenerimaanIns.postPenerimaan(metadata);
        
        body.forEach(async (data)=>{
            if (data.jumlah > 0) {
                const postDetilPenerimaan = await PenerimaanIns.postDetilPenerimaan({data: data, idpenerimaan: postPenerimaan[0].insertId})
            }
        })

        res.status(201).json({
            success: 'true'
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

//? Penjualan ?//
const getPenjualanAll = async (req, res) => {
    const connection = req.connection
    const penjualanIns = new Penjualan(connection)

    const { date, id, margin } = req.query

    try {
        const penjualanGet = await penjualanIns.all({date:date, id:id, margin:margin})
        return res.status(201).json({
            success: true,
            penjualan: penjualanGet
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) {await connection.end()}
    }
}

const getPenjualanDetil = async (req, res) => {
    const connection = req.connection
    const penjualanIns = new Penjualan(connection)

    const { id } = req.params

    try {
        const penjualanGet = await penjualanIns.all({id:id})
        const penjualanDetilGet = await penjualanIns.detil({idpenjualan: id})
        return res.status(201).json({
            success: true,
            penjualan: {penjualan: penjualanGet[0], detil_penjualan: penjualanDetilGet[0]}
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) {await connection.end()}
    }
}

const getMarginPenjualan = async (req, res) => {
    const connection = req.connection
    const penjualanIns = new Penjualan(connection)

    const { all, id } = req.query

    try {
        const allMargin = await penjualanIns.getMargin({all: ((all == 'false')? false : true ), id: id})

        return res.status(201).json({
            success: true,
            status: 200,
            margin: allMargin
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }

}

const activateMarginPenjualan = async (req, res) => {
    const connection = req.connection
    const penjualanIns = new Penjualan(connection)

    const { idMargin } = req.body
    
    try {
        const findMargin = await penjualanIns.getMargin({id: idMargin})
        
        if (findMargin.length < 1) {
            throw new CustomError('Cannot Find Margin ID = '+idMargin, 404)
        }

        let success = null
        success = await penjualanIns.activateMargin({idMargin: idMargin})
        return res.status(201).json({
            success: true,
            data: success
        })
    } catch (error) {
        throw new CustomError(error, error.statusCode?error.statusCode : 500)
    } finally {
        if (connection) await connection.end()
    }
} 

const createPenjualan = async (req, res) => {
    const connection = req.connection
    const penjualanIns = new Penjualan(connection)

    const { metaPenjualan, detilPenjualan } = req.body

    try {
        const createPenjualan = await penjualanIns.createPenjualan({data:{iduser: metaPenjualan.id_user}})

        // return res.json({hi:'hello'})

        let insertDetilPenjualan = await Promise.all(
            detilPenjualan.map(detil=>(
                penjualanIns.insertDetilPenjualan({data: {brg_id: detil.brg_id, jumlah: detil.jumlah}})
            ))
        )

        return res.status(201).json({
            success: true,
            createPenjualan: createPenjualan,
            insertDetilPenjualan: insertDetilPenjualan
        })
    } catch (error) {
        throw new CustomError(error, 500);
    } finally {
        if (connection) await connection.end()
    }
}

module.exports = {
    getPengadaan,
    getPengadaanDetil,
    createPenerimaan,
    getPenerimaanPengadaanDetilID,
    getKartuStok,
    getPenerimaan,
    createPengadaan,
    getMarginPenjualan,
    activateMarginPenjualan,
    createPenjualan,
    getPenjualanAll,
    getPenjualanDetil,
    deletePengadaan,
}
