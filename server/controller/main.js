const { CustomError } = require("../error/CustomError");
const { Barang } = require("../model/ModelBarang");
const { Pengguna } = require("../model/ModelPengguna");


const getAllPengguna = async (req, res) => {
    const connection = req.connection
    const PenggunaIns = new Pengguna(connection)

    try {
        const penggunaAll = await PenggunaIns.all()
        
        res.status(200).json({
            pengguna: penggunaAll
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const allWithRole = async (req, res) => {
    const connection = req.connection
    const PenggunaIns = new Pengguna(connection)

    try {
        const penggunaAllRole = await PenggunaIns.allWithRole()
        
        res.status(200).json({
            pengguna: penggunaAllRole
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getBarangStok = async (req, res) => {
    const connection = req.connection
    try {
        const barangIns = new Barang(connection)

        const { all } = req.query;

        const barangStok = await barangIns.allWithStok({all: all})
        res.status(200).json({
            barang: barangStok
        })

    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getVendor = async (req, res) => {
    const connection = req.connection
    try {
        const barangIns = new Barang(connection)

        const { all } = req.query;

        const barangVendor = await barangIns.allVendor({all: all})
        res.status(200).json({
            vendor: barangVendor
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getRole = async (req, res) => {
    const connection = req.connection

    try {
        const penggunaIns = new Pengguna(connection)

        const roles = await penggunaIns.getRole()
        return res.status(201).json({
            success: true,
            roles: roles
        })
        
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const postUser = async (req, res) => {
    const connection = req.connection
    const { data_user } = req.body

    try {
        const penggunaIns = new Pengguna(connection)
        const postPengguna = await penggunaIns.postPengguna({nama: data_user.nama, idrole: data_user.idrole, pass: data_user.pass})
        return res.status(200).json({
            success: true,
            response: postPengguna
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const getJenisBarang = async (req, res) => {
    const connection = req.connection

    try {
        const barangIns = new Barang(connection)
        const getSatuan = await barangIns.getSatuan()

        return res.status(200).json({
            success: true,
            satuan: getSatuan
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

const postBarang = async (req, res) => {
    const connection = req.connection

    const { data_barang } = req.body

    try {
        const barangIns = new Barang(connection)
        const createBarang = await barangIns.postBarang({nama: data_barang.nama, idsatuan: data_barang.idsatuan, jenis: data_barang.jenis_char, harga: data_barang.harga})

        return res.status(200).json({
            success: true,
            response: createBarang
        })
    } catch (error) {
        throw new CustomError(error, 500)
    } finally {
        if (connection) await connection.end()
    }
}

// const getAllVendor = async (req, res) => {
//     try {
//         const connection = req.connection
//         const barangIns = new Barang(connection)
//         const allBarangStok = await barangIns.allWithStok()

//         res.status(200).json({
//             barang: allBarangStok
//         })

//     } catch (error) {
//         throw new CustomError('Query Fails', 500)
//     } finally {
//         if (connection) await connection.end()
//     }
// }

module.exports = {
    getAllPengguna,
    allWithRole,
    getBarangStok,
    getVendor,
    getRole,
    postUser,
    getJenisBarang,
    postBarang
}
