import { MapPin, Users, TrendingUp, LogOut, LayoutDashboard, Tickets, Car } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/destination', icon: MapPin, label: 'Destinasi' },
    { path: '/order', icon: Tickets, label: 'Pesanan' },
    { path: '/akomodasi', icon: Car, label: 'Akomodasi' },
    { path: '/user', icon: Users, label: 'Pengguna' },
    { path: '/laporan', icon: TrendingUp, label: 'Laporan' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div
      className={`${open ? 'w-64' : 'w-0'} bg-white transition-all duration-300 overflow-hidden border-r border-gray-200 relative h-screen`}
    >
      <div className="p-6">

        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 text-teal-600 text-2xl font-bold">
            <img src="/travaLogo.png" className="w-40 h-auto ml-4" />
          </div>
        </div>

        <div className="h-[2px] bg-[#389CA4] mb-6"></div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-[#389CA4] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#389CA4]'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-20 left-6 right-6">
        <div className="h-[2px] bg-[#389CA4]"></div>
      </div>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#389CA4] hover:text-[#2d7f85] transition-colors"
        >
          <span className="text-sm">Keluar</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}