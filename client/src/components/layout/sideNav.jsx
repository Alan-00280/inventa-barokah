import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SubSideNav from "./subSideNav";
import { NavLink } from "react-router";

export default function SideNav({isCollapsed, setIsCollapsed, ...props}) {
    // const [openSideNav, setOpenSideNav] = useState(props.isCollapsed);
    const sideNavLinks = props.navLinksData;

    const sideNavs = () => sideNavLinks.map(section => (
        <div key={section.header}>
            <NavLink
                to={section.href}
                className={({ isActive }) =>
                    [
                    "block px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 select-none my-1",
                    isActive
                        ? "hover:bg-barokah-50 bg-barokah-100 text-barokah-800 font-semibold border-l-4 border-barokah-600 shadow-inner"
                        : "text-barokah-600 hover:bg-barokah-100"
                    ].join(" ")
                }
            >
                {section.header}
            </NavLink>
            <ul className="space-y-1">
            {section.menus.map(menu => (
                <div key={menu.href}>
                <li>
                {!menu.submenu && (
                    <NavLink
                    to={menu.href}
                    className={({isActive}) => (
                        isActive ? 'block pl-7 py-1 text-sm rounded-lg bg-barokah-100 hover:text-barokah-700 transition-colors text-barokah-600 duration-200 px-10' : 'block pl-7 py-1 text-sm rounded-lg hover:bg-barokah-100 hover:text-barokah-700 transition-colors duration-200 px-10'
                    )}
                    end
                    >
                    {menu.title}
                    </NavLink>
                )}
                </li>
                {menu.submenu && <SubSideNav key={menu.href} menu={menu} />}
                </div>
            ))}
            </ul>
        </div>
    ));


    return (
        <aside
            className={`${ isCollapsed ? "w-55" : "w-20" } flex flex-col min-h-screen p-4 transition-all duration-300 ease-in-outbg-dasar-50 text-dasar-900 ring-1 ring-dasar-200 shadow-sm max-h-300 overflow-hidden`}
            >
            {/* Header */}
            <div className="flex items-center justify-between">
                {isCollapsed && (
                <h2 className="text-lg font-semibold text-barokah-700 truncate">
                    {props.heading}
                </h2>
                )}

                <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-barokah-100 transition-colors duration-300"
                >
                {isCollapsed ? (
                    <ChevronLeft size={20} className="text-barokah-600 hover:text-barokah-700" />
                ) : (
                    <ChevronRight size={20} className="text-barokah-600 hover:text-barokah-700" />
                )}
                </button>
            </div>

            {/* Isi Sidebar */}
            <div
                className={`flex-1 overflow-hidden ${
                isCollapsed ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
            >
                {isCollapsed && 
                    sideNavs()
                }
            </div>
        </aside>
    );
}