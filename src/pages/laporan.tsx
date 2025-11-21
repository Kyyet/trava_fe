import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Chart from "chart.js/auto";
import Sidebar from "../components/sideBar";
import HeaderPage from "../components/header";

export default function LaporanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = "Mame Telhozenia";
  const role = "Admin";

  const transaksi = Array.from({ length: 28 }).map((_, i) => ({
    id: "TRX-" + (1000 + i),
    userId: "USR-" + (2000 + i),
    destinasi: "Destinasi " + (i + 1),
    mulai: "14 Nov 2025",
    selesai: "21 Nov 2025",
    totalTiket: (i % 5) + 1,
    biayaTransport: "Rp. 200.000",
    totalBiaya: "Rp. 5.600.000",
    status: "Selesai",
  }));

  const totalPages = Math.ceil(transaksi.length / itemsPerPage);

  const paginatedData = transaksi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getChartValues = () => {
    if (selectedFilter === "Pemasukan") return [100, 0];
    if (selectedFilter === "Pengeluaran") return [0, 100];
    return [55, 45];
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) chartInstance.current.destroy();

    const [in1, in2] = getChartValues();
    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Pemasukan", "Pengeluaran"],
        datasets: [
          {
            data: [in1, in2],
            backgroundColor: ["#389CA4", "#333"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "60%",
        plugins: { legend: { display: false } },
      },
    });
  }, [selectedFilter]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 overflow-auto">

        <HeaderPage
          title="Laporan"
          name={name}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-8">

          <div className="bg-white rounded-xl p-6 shadow-sm mb-10">
            <h2 className="text-lg font-semibold mb-4">Riwayat Pesanan</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F0FAFA] text-[#389CA4] font-semibold">
                    <th className="border p-2">ID Transaksi</th>
                    <th className="border p-2">User ID</th>
                    <th className="border p-2">Destinasi</th>
                    <th className="border p-2">Tgl. Mulai</th>
                    <th className="border p-2">Tgl. Selesai</th>
                    <th className="border p-2">Total tiket</th>
                    <th className="border p-2">Biaya Transportasi</th>
                    <th className="border p-2">Total Biaya</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={index} className="text-gray-700">
                      <td className="border p-2">{item.id}</td>
                      <td className="border p-2">{item.userId}</td>
                      <td className="border p-2">{item.destinasi}</td>
                      <td className="border p-2">{item.mulai}</td>
                      <td className="border p-2">{item.selesai}</td>
                      <td className="border p-2 text-center">{item.totalTiket}</td>
                      <td className="border p-2">{item.biayaTransport}</td>
                      <td className="border p-2">{item.totalBiaya}</td>
                      <td className="border p-2 text-green-600">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-2 py-4 bg-white border-t">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    currentPage === i + 1
                      ? "bg-[#389CA4] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white border border-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Laporan Keuangan</h2>

              <div ref={dropdownRef} className="relative w-40 mb-6">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-[#389CA4] text-[#389CA4] text-xs px-3 py-2 rounded-lg"
                >
                  <span>{selectedFilter}</span>
                  <ChevronDown
                    size={16}
                    className={`${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow">
                    {["Semua", "Pemasukan", "Pengeluaran"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedFilter(opt);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#F0FAFA] text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#389CA4]" />
                  <span>Pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#333]" />
                  <span>Pengeluaran</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
              <div className="h-64 w-64">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}