import { Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderPageProps {
  title: string;
  subtitle?: string;
  name: string;
  role: string;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function HeaderPage({
  title,
  subtitle,
  name,
  role,
  sidebarOpen,
  setSidebarOpen,
  showSearch = false,
  searchValue = "",
  onSearchChange
}: HeaderPageProps) {

  const navigate = useNavigate();

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between relative">
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-sm -mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-[#E5E2E2] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#389CA4] bg-[#E5E2E2]"
            />
          </div>
        </div>
      )}

      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">{initials}</span>
        </div>
        <div className="text-sm">
          <div className="font-medium">{name}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}