console.log('=========== Inventa Barokah 2 Back-End ===============');


const express = require('express');
const app = express();
const cors = require('cors')

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({'extended': false}));


// app.get('/', (req, res)=>{
//     res.json({
//         'Server': 'Online'
//     })
// })

const APIRoute = process.env.APIROUTE

const indexRoute = require('./routes/index')
app.use(APIRoute, indexRoute)

const penggunaRoute = require('./routes/pengguna')
app.use(APIRoute + '/pengguna', penggunaRoute)

const barangRoute = require('./routes/barang')
app.use(APIRoute + '/barang', barangRoute)

const pengadaanRoute = require('./routes/pengadaan')
app.use(APIRoute + '/pengadaan', pengadaanRoute)

const penerimaanRoute = require('./routes/penerimaan')
app.use(APIRoute + '/penerimaan', penerimaanRoute)

const penjualanRoute = require('./routes/penjualan');
app.use(APIRoute + '/penjualan', penjualanRoute)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: 'URL Not-Found'
    })
}) 

const errorHandler = require('./error/errorHandler')
app.use(errorHandler);

const port = process.env.PORT || 5000
const start = async () => {
    try {
        app.listen(port, ()=>{
            console.log(`Server listening on ${port} . . .`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();
