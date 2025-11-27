import { Outlet } from "react-router" 
import Footer from "./footer"
import TopNav from "./topNav"
import SideNav from "./sideNav"
import { useState } from "react";
import sideNavLink from "../../routes/sideNavLink";

export default function TemplateDashboard() {
    const sideNavLinksData = sideNavLink
    
    const heading = 'Dashboard';
    const [isCollapsed, setIsCollapsed] = useState(true)

    // {
    //     header: 'Transactional',
    //     href: '/transaksi',
    //     menus: [
    //         {title: 'Pengguna', href:'/master-data/pengguna', submenu: [
    //             {title: 'Apa', href: '#'},
    //         ]},
    //         {title: 'Barang', href:'/master-data/barang'},
    //         {title: 'Vendor', href:'/master-data/vendor'}
    //     ]
    // }

    return ( 
        <div className="min-h-screen mt-16">
            <TopNav />
            <div className="flex min-h-screen">
                <aside className="z-40 fixed top-16 bottom-0 left-0 bg-white">
                    <SideNav 
                        navLinksData={sideNavLinksData} 
                        heading={heading}
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />
                </aside>
                <main className={`p-5 flex-1 transition-all ease-in ${isCollapsed ? 'pl-56' : 'pl-28'}`}>
                    <div className="">
                    <Outlet />
                    </div>
                </main>
            </div>
            <div className={`transition-all ease-in ${isCollapsed ? 'pl-56' : 'pl-28'}`}>
                <Footer />
            </div>
        </div>
    )
}
