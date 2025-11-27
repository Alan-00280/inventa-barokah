import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";

export default function SubSideNav({ menu }) {
    const [openSubNav, setOpenSubNav] = useState(false);
    return (
        <li className="flex flex-col">
            <NavLink
                to={menu.href}
                className={({ isActive }) => (
                    [
                        "flex items-center justify-between rounded-lg px-4 pl-1 py-1 cursor-pointer select-none transition-colors duration-200",
                        (
                            isActive ? 'text-sm rounded-lg bg-barokah-100 hover:text-barokah-700 transition-colors text-barokah-600 duration-200' : 'text-dasar-800 hover:text-barokah-700 hover:bg-barokah-100'
                        ),
                        
                    ].join(" ")
                )
                }
            >
                <span className="flex-1 text-sm pl-6">{menu.title}</span>

                {menu.submenu && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault(); // ⛔ cegah NavLink ikut jalan
                            setOpenSubNav(!openSubNav);
                        }}
                        className="p-1 rounded-md hover:bg-barokah-200 transition-colors"
                    >
                        {openSubNav ? (
                            <ChevronDown size={14} className="text-barokah-600" />
                        ) : (
                            <ChevronRight size={14} className="text-barokah-600" />
                        )}
                    </button>
                )}
            </NavLink>


            {openSubNav && (
                <ul className="ml-4 mt-1 border-l border-dasar-200 pl-3 space-y-1">
                    {menu.submenu.map(submenu => (
                        <li key={submenu.href}>
                            <NavLink
                                to={submenu.href}
                                className="block px-2 py-1 text-sm text-dasar-700 rounded-md hover:bg-barokah-100 hover:text-barokah-700 transition-colors"
                                end
                            >
                                {submenu.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}