const sideNavLink = [
            {
                header: 'Dashboard',
                href: '/dashboard',
                menus: [
                ]
            }, 
            {
                header: 'Master Data',
                href: '/master-data',
                menus: [
                    {title: 'Pengguna', href:'/master-data/pengguna'},
                    {title: 'Barang', href:'/master-data/barang', submenu: [
                        {title: 'Kartu Stock', href:'/transaksi/kartu-stok'}
                    ]},
                    {title: 'Vendor', href:'/master-data/vendor'},
                    {title: 'Margin Penjualan', href:'/master-data/margin'}
                ]
            }, 
            {
                header: 'Transactional',
                href: '/transaksi',
                menus: [
                    {title: 'Pengadaan', href:'/transaksi/pengadaan'},
                    {title: 'Penerimaan', href:'/transaksi/penerimaan', submenu:[
                        {title: 'Terima Pengadaan', href:'/transaksi/terima-pengadaan'}
                    ]},
                    {title: 'Penjualan', href:'/transaksi/penjualan'}
                ]
            }
        ];

export default sideNavLink