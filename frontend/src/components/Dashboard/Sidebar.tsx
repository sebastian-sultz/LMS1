// components/Dashboard/Sidebar.tsx
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

interface User {
  isAdmin?: boolean;
}

const baseMenuItems = [
  { name: "Dashboard",  path: "/dashboard" },
  { name: "Apply For Loan", path: "/dashboard/apply-loan" },
  { name: "Settings", path: "" },
]

interface SidebarProps {
  onLogout?: () => void;
  user?: User;
}

export function Sidebar({ onLogout, user }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const menuItems = user?.isAdmin 
    ? [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Loans", path: "" },
        { name: "Settings", path: "" },
      ]
    : baseMenuItems;

  const handleNavigation = (path: string) => {
    if (path) {
      navigate(path);
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  }

  const isActive = (path: string) => {
    return currentPath === path;
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-[#001336] text-white flex flex-col justify-between transition-all duration-300 md:w-64 sm:w-20">
      <div>
        <nav className="mt-11 space-y-2 px-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center gap-2 w-full rounded-full px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white text-[#001336]"
                    : "text-gray-300 hover:bg-white/10"
                )}
              >
                <span className="hidden sm:hidden md:inline">{item.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Logout Button - Added at the bottom */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2 w-full rounded-full px-4 py-3 text-sm font-medium transition text-gray-300 hover:bg-white/10"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  )
}