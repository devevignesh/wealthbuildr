"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabs() {
    const pathname = usePathname();

    const tabs = [
        { name: "Accumulation", href: "/accumulation-phase" },
        { name: "Growth", href: "/growth-phase" },
        { name: "Independent", href: "/independent-phase" },
        { name: "Abundant", href: "/abundant-phase" },
        { name: "Settings", href: "/settings/general" },
    ];

    return (
        <div className="scrollbar-hide mb-[-3px] flex h-12 items-center justify-start space-x-2 overflow-x-auto">
            {tabs.map(({ name, href }) => (
                <Link key={href} href={href} className="relative">
                    <div className="m-1 rounded-md px-3 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
                        <p className="text-sm text-gray-600 hover:text-black">{name}</p>
                    </div>
                    {(pathname === href || pathname?.startsWith(href)) && (
                        <motion.div
                            layoutId="indicator"
                            transition={{
                                duration: 0.25
                            }}
                            className="absolute bottom-0 w-full px-1.5"
                        >
                            <div className="h-0.5 bg-black" />
                        </motion.div>
                    )}
                </Link>
            ))}
        </div>
    );
}
