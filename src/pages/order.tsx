import { useState } from 'react';
import { User, MapPin, Calendar, X } from 'lucide-react';
import Sidebar from '../components/sideBar';
import Header from '../components/header';

interface Order {
  id: string;
  code: string;
  customerName: string;
  destination: string;
  date: string;
  totalPrice: number;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Selesai';
  departureDate?: string;
  returnDate?: string;
  accommodation?: string;
  totalTickets?: number;
  paymentMethod?: string;
  image?: string;
}

export default function Pesanan() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Menunggu' | 'Disetujui' | 'Ditolak'>('Semua');
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      code: 'TRV001',
      customerName: 'Salmah Nadya Safitri',
      destination: 'Nusa Penida',
      date: '14 November 2025 - 21 November 2025',
      totalPrice: 1200000,
      status: 'Menunggu',
      departureDate: '14 November 2025',
      returnDate: '21 November 2025',
      accommodation: 'Kapal',
      totalTickets: 2,
      paymentMethod: 'Transfer bank (BCA)',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80'
    },
    {
      id: '2',
      code: 'TRV002',
      customerName: 'John Doe',
      destination: 'Bali',
      date: '10 Desember 2025 - 15 Desember 2025',
      totalPrice: 2000000,
      status: 'Menunggu',
      departureDate: '10 Desember 2025',
      returnDate: '15 Desember 2025',
      accommodation: 'Hotel',
      totalTickets: 3,
      paymentMethod: 'Transfer bank (BCA)',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80'
    },
  ]);

  const name = "Mame Tidumbe";
  const role = "Admin";

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'Semua' || order.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'bg-[#389CA4] text-white';
      case 'Disetujui': return 'bg-green-500 text-white';
      case 'Ditolak': return 'bg-red-500 text-white';
      case 'Selesai': return 'bg-gray-500 text-white';
      default: return 'bg-gray-100 text-white';
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleApproveFinal = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => (o.id === selectedOrder.id ? { ...o, status: 'Disetujui' } : o)));
    setOpenApproveModal(false);
    setOpenModal(false);
  };

  const handleRejectFinal = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => (o.id === selectedOrder.id ? { ...o, status: 'Ditolak' } : o)));
    setRejectReason('');
    setOpenRejectModal(false);
    setOpenModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 overflow-auto">
        <Header
          title="Pesanan"
          subtitle="Kelola tiket dan pembayaran"
          name={name}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showSearch={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-8">

          <div className="flex gap-2 mb-6">
            {['Semua', 'Menunggu', 'Disetujui', 'Ditolak'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#389CA4] text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{order.code}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{order.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{order.date}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Total harga</p>
                      <p className="text-lg font-semibold text-teal-600">
                        Rp. {order.totalPrice.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleViewDetail(order)}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      Lihat Detail
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenApproveModal(true);
                      }}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                    >
                      Konfirmasi
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <p className="text-gray-500">Tidak ada pesanan ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {openModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[700px] rounded-xl shadow-xl relative">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{selectedOrder.code}</h2>
              <button onClick={() => setOpenModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={22} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-[2fr_1fr] gap-6">
                
                <div className="space-y-4">
                  {[
                    ['Nama Pelanggan', selectedOrder.customerName],
                    ['Tujuan', selectedOrder.destination],
                    ['Tanggal Berangkat', selectedOrder.departureDate],
                    ['Estimasi tiba', selectedOrder.returnDate],
                    ['Akomodasi', selectedOrder.accommodation],
                    ['Total tiket', `${selectedOrder.totalTickets} tiket`],
                    ['Total bayar', `Rp ${selectedOrder.totalPrice.toLocaleString('id-ID')}`, true],
                    ['Tipe Pembayaran', selectedOrder.paymentMethod],
                  ].map(([label, value, red], idx) => (
                    <div key={idx}>
                      <p className="text-sm text-gray-600 mb-1">{label}</p>
                      <div
                        className={`px-3 py-2 rounded-md text-sm ${
                          red ? 'bg-gray-200 text-red-600 font-semibold' : 'bg-gray-200'
                        }`}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col w-[300px] mt-6">
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedOrder.image}
                      alt={selectedOrder.destination}
                      className="w-full h-[200px] object-cover"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpenApproveModal(true)}
                      className="flex-1 bg-[#303030] text-white py-2.5 rounded-lg hover:bg-[#404040]"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => setOpenRejectModal(true)}
                      className="flex-1 bg-[#A43838] text-white py-2.5 rounded-lg hover:bg-[#8B2F2F]"
                    >
                      Tolak
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {openApproveModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-xl text-center">

            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center border-4 border-teal-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={2} stroke="rgb(20, 135, 140)" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">Yakin menyetujui orderan ini?</h2>
            <p className="text-gray-500 text-sm mb-8">Cek kebenaran data sebelum menyetujui</p>

            <div className="flex gap-4">
              <button
                onClick={handleApproveFinal}
                className="flex-1 py-2.5 bg-[#303030] text-white rounded-full hover:bg-[#404040]"
              >
                Kirim
              </button>
              <button
                onClick={() => setOpenApproveModal(false)}
                className="flex-1 py-2.5 bg-[#B03A3A] text-white rounded-full hover:bg-[#9A3232]"
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

      {openRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          
          <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-xl text-center">

            <div className="mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth={2.2} stroke="#A43838"
                className="w-14 h-14 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-[#A43838] mb-2">
              Yakin menolak orderan ini?
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Jika anda yakin, sertakan alasan anda menolak orderan ini kepada pelanggan
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="....."
              className="w-full h-28 rounded-lg p-3 text-sm bg-[#E5E5E5] border-none focus:ring-0"
            />
            
            <div className="flex gap-4 mt-6">
              
              <button
                onClick={handleRejectFinal}
                disabled={rejectReason.trim().length === 0}
                className={`flex-1 py-2.5 rounded-full text-white font-medium transition ${
                  rejectReason.trim().length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#303030] hover:bg-[#404040]'
                }`}
              >
                Kirim
              </button>

              <button
                onClick={() => setOpenRejectModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#B03A3A] text-white font-medium hover:bg-[#9A3232]"
              >
                Batal
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
