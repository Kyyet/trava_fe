import { useState, useEffect, useRef } from 'react';
import { MapPin, FileText, Users, ChevronDown } from 'lucide-react';
import * as ChartJS from 'chart.js';
import Sidebar from '../components/sideBar';
import HeaderPage from '../components/header';

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('Semua Destinasi');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS.Chart | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = "Mame Tidumbe";
  const role = "Admin";

  const salesData = [
    { month: 'Jan', value: 350 },
    { month: 'Feb', value: 480 },
    { month: 'Mar', value: 120 },
    { month: 'Apr', value: 420 },
    { month: 'May', value: 780 },
    { month: 'Jun', value: 650 },
    { month: 'Jul', value: 520 },
    { month: 'Aug', value: 460 },
    { month: 'Sept', value: 640 },
    { month: 'Oct', value: 520 },
    { month: 'Nov', value: 720 },
    { month: 'Dec', value: 0 }
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    ChartJS.Chart.register(
      ChartJS.BarController,
      ChartJS.BarElement,
      ChartJS.CategoryScale,
      ChartJS.LinearScale,
      ChartJS.Tooltip,
      ChartJS.Legend
    );

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new ChartJS.Chart(ctx, {
      type: 'bar',
      data: {
        labels: salesData.map((d) => d.month),
        datasets: [
          {
            label: 'Penjualan',
            data: salesData.map((d) => d.value),
            backgroundColor: '#389CA4',
            hoverBackgroundColor: '#389CA4',
            borderRadius: 6,
            barThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1250,
            ticks: { stepSize: 250 }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 overflow-auto">
        <HeaderPage
          title="Selamat Datang, Admin"
          name={name}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#389CA4]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Total Destinasi</div>
                  <div className="text-3xl font-bold text-gray-900">17</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#389CA4]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Total Pesanan aktif</div>
                  <div className="text-3xl font-bold text-gray-900">17</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#389CA4]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Pengguna terdaftar</div>
                  <div className="text-3xl font-bold text-gray-900">17</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#389CA4]">

            <div className="flex flex-col gap-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Grafik Penjualan
              </h2>

              <div ref={dropdownRef} className="relative w-35">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-[#fff] border border-[#389CA4] text-[#389CA4] text-xs font-medium px-2 py-2 rounded-lg"
                >
                  <span>{selectedFilter}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    {['Semua Destinasi', 'Destinasi Populer', 'Destinasi Baru'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedFilter(opt);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F0FAFA]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative h-80 mt-4">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
