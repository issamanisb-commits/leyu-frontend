import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Icons from "./Icons";
import { MenuItem as MenuItemType } from "./menuConfig";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface MenuItemProps {
  item: MenuItemType;
  isSidebarOpen: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isSidebarOpen }) => {
  const pathname = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(isSidebarOpen);
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  
  // Check if authenticated (status === "authenticated") and has token
  const isAuthenticated = status === "authenticated" && !!session?.access_token;


  const toggleSubMenu = () => {
    if (item.subItems) {
      setIsSubMenuOpen(!isSubMenuOpen);
    }
  };

  const isActive = () => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href);
    }
    
    // Special handling for project-related routes
    if (item.href === "/projectmanager/project") {
      return pathname.startsWith("/projectmanager/project") || 
             pathname.startsWith("/projectmanager/tasks/");
    }
    
    if (item.href === "/superadmin/project") {
      return pathname === "/superadmin/project" || 
             pathname.startsWith("/superadmin/projectDetail/") ||
             pathname === "/superadmin/tasks";
    }
    
    if (item.href === "/superadmin/projectArchive") {
      return pathname === "/superadmin/projectArchive";
    }
    
    return false;
  };

  const active = isActive();

  // Always use Link component for internal navigation to maintain React state
  const renderLink = (href: string, labelKey: string, isMainItem = false) => {
    const label = t(labelKey as any);
    const baseClasses = isMainItem 
      ? `flex items-center flex-1 text-lg ${active ? "text-bold text-primary bg-[#095FAF]/10 rounded-2xl p-2" : "text-gray-700 hover:text-primary"}`
      : `block text-base ${pathname === href ? "text-primary bg-[#095FAF]/10 rounded-2xl p-2" : "text-gray-700 hover:text-primary"}`;

    return (
      <Link href={href} className={baseClasses}>
        {isMainItem && (
          <>
            <Icons
              iconName={item.iconName}
              isActive={active}
              className="mr-3 h-6 w-6"
            />
            {isSidebarOpen && <span>{label}</span>}
          </>
        )}
        {!isMainItem && label}
      </Link>
    );
  };

  return (
    <li>
      <div className="flex items-center justify-between py-2">
        {renderLink(item.href, item.labelKey as string, true)}
        
        {item.subItems && isSidebarOpen && (
          <button
            onClick={toggleSubMenu}
            className="p-2 focus:outline-none"
            aria-label={isSubMenuOpen ? t('collapseSubmenu') : t('expandSubmenu')}
          >
            <ChevronDown
              className={`h-6 w-6 text-gray-900 transition-transform duration-200 ${
                isSubMenuOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        )}
      </div>
      
      {item.subItems && isSubMenuOpen && isSidebarOpen && (
        <ul className="ml-8 mt-2 space-y-4">
          {item.subItems.map((subItem) => (
            <li key={subItem.href}>
              {renderLink(subItem.href, subItem.labelKey as string)}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;