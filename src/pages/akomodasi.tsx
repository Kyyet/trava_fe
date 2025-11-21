import { useState, useRef, useEffect } from 'react';
import { Car, Plane, Bus, Ship, Bed, Edit, Trash2, Map, CarFront, Plus, ChevronDown, X } from 'lucide-react';
import Sidebar from '../components/sideBar';
import HeaderPage from "../components/header";

interface Accommodation {
  id: number;
  destination: string;
  transport: string;
  type: 'Mobil' | 'Pesawat' | 'Bus' | 'Kapal Laut';
  code: string;
  description: string;
  price: number;
}

export default function Akomodasi() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Mobil' | 'Bus' | 'Pesawat' | 'Kapal'>('Semua');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [openEditFor, setOpenEditFor] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = "Mame Tidumbe";
  const role = "Admin";

  const [selectedDestination, setSelectedDestination] = useState('Pilih destinasi');
  const [editingDestination, setEditingDestination] = useState<string | null>(null);
  const [transportOptions, setTransportOptions] = useState([
    { type: 'Mobil', checked: false, price: '', detail: '' },
    { type: 'Bus', checked: false, price: '', detail: '' },
    { type: 'Pesawat', checked: false, price: '', detail: '' },
    { type: 'Kapal Laut', checked: false, price: '', detail: '' }
  ]);

  const [vehicleId, setVehicleId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState('');

  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    { id: 1, destination: 'Pantai Pink', transport: '4 Opsi Transportasi', type: 'Mobil', code: 'XXXXX1', description: 'Innova Reborn - Gedung Perak Plaza Pink', price: 500000 },
    { id: 2, destination: 'Pantai Pink', transport: '4 Opsi Transportasi', type: 'Pesawat', code: 'XXXXX2', description: 'Bandi Soekarno Hatta - Bandi International Lombok', price: 1700000 },
    { id: 3, destination: 'Pantai Pink', transport: '4 Opsi Transportasi', type: 'Kapal Laut', code: 'XXXXX3', description: 'Pelabuhan Paciran - Pelabuhan Tanjungjaya', price: 1200000 },
    { id: 4, destination: 'Pantai Pink', transport: '4 Opsi Transportasi', type: 'Bus', code: 'XXXXX4', description: 'Bus wisata AC Yogyakarta', price: 350000 }
  ]);

  const destinationOptions = ['Pantai Pink', 'Bali', 'Yogyakarta', 'Lombok'];

  const filteredAccommodations = accommodations.filter(item => {
    const matchesSearch =
      item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'Semua' ||
      (activeTab === 'Kapal' && item.type === 'Kapal Laut') ||
      item.type === activeTab;

    return matchesSearch && matchesTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'Mobil': return <Car className="w-5 h-5" />;
      case 'Pesawat': return <Plane className="w-5 h-5" />;
      case 'Bus': return <Bus className="w-5 h-5" />;
      case 'Kapal Laut': return <Ship className="w-5 h-5" />;
      default: return <Bed className="w-5 h-5" />;
    }
  };

  const groupedAccommodations = filteredAccommodations.reduce((acc, item) => {
    if (!acc[item.destination]) acc[item.destination] = [];
    acc[item.destination].push(item);
    return acc;
  }, {} as Record<string, Accommodation[]>);

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akomodasi ini?')) {
      setAccommodations(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteDestination = (destination: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus semua akomodasi untuk destinasi "${destination}"?`)) {
      setAccommodations(prev => prev.filter(item => item.destination !== destination));
      setShowDestinationModal(false);
      setOpenEditFor(null);
    }
  };

  const handleAddAccommodation = () => {
    setOpenEditFor(null);
    setShowAddMenu(prev => !prev);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingDestination(null);
    setShowDestinationModal(true);
    setShowAddMenu(false);
  };

  const openEditModal = (destination: string) => {
    setModalMode('edit');
    setEditingDestination(destination);
    setSelectedDestination(destination);
    
    const existingItems = accommodations.filter(item => item.destination === destination);
    const updatedTransportOptions = transportOptions.map(option => {
      const existing = existingItems.find(item => item.type === option.type);
      if (existing) {
        return {
          type: option.type,
          checked: true,
          price: existing.price.toString(),
          detail: existing.description
        };
      }
      return { ...option, checked: false, price: '', detail: '' };
    });
    
    setTransportOptions(updatedTransportOptions);
    setShowDestinationModal(true);
    setOpenEditFor(null);
  };

  const openTypeModal = (mode: 'add' | 'edit' = 'add') => {
    setModalMode(mode);
    setShowTypeModal(true);
    setShowAddMenu(false);
    setOpenEditFor(null);
  };

  const handleReset = () => {
    setSelectedDestination('Pilih destinasi');
    setTransportOptions([
      { type: 'Mobil', checked: false, price: '', detail: '' },
      { type: 'Bus', checked: false, price: '', detail: '' },
      { type: 'Pesawat', checked: false, price: '', detail: '' },
      { type: 'Kapal Laut', checked: false, price: '', detail: '' }
    ]);
  };

  const handleSave = () => {
    if (selectedDestination === 'Pilih destinasi') {
      alert('Silakan pilih destinasi terlebih dahulu');
      return;
    }

    const checkedTransports = transportOptions.filter(item => item.checked);
    if (checkedTransports.length === 0) {
      alert('Pilih minimal satu transportasi');
      return;
    }

    if (modalMode === 'edit' && editingDestination) {
      setAccommodations(prev => prev.filter(item => item.destination !== editingDestination));
    }

    const newAccommodations: Accommodation[] = checkedTransports.map((transport, index) => {
      const maxId = accommodations.length > 0 ? Math.max(...accommodations.map(a => a.id)) : 0;
      return {
        id: maxId + index + 1,
        destination: selectedDestination,
        transport: `${checkedTransports.length} Opsi Transportasi`,
        type: transport.type as 'Mobil' | 'Pesawat' | 'Bus' | 'Kapal Laut',
        code: `XXXXX${maxId + index + 1}`,
        description: transport.detail,
        price: parseInt(transport.price) || 0
      };
    });

    setAccommodations(prev => [...prev, ...newAccommodations]);
    setShowDestinationModal(false);
    handleReset();
  };

  const updateTransport = (index: number, field: string, value: any) => {
    setTransportOptions(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 overflow-auto">
        <HeaderPage
          title="Akomodasi"
          subtitle="Kelola transportasi untuk setiap destinasi"
          name={name}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showSearch={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-8">
          <p className="text-sm text-gray-600 mb-4">Lihat berdasarkan tipe kendaraan</p>

          <div className="flex gap-2 mb-6">
            {['Semua', 'Mobil', 'Bus', 'Pesawat', 'Kapal'].map((tab) => (
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

          <div className="space-y-6">
            {Object.keys(groupedAccommodations).length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <p className="text-gray-500">Destinasi tidak tersedia</p>
              </div>
            ) : (
            Object.entries(groupedAccommodations).map(([destination, items], index) => (
              <div key={destination} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{destination}</h3>
                    <p className="text-sm text-gray-500">{items[0].transport}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      setOpenEditFor(openEditFor === index ? null : index);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>

                  {openEditFor === index && (
                    <div className="absolute top-12 right-6 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-56 z-20">
                      <button
                        onClick={() => openEditModal(destination)}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                      >
                        <Map size={18} />
                        Perjalanan Destinasi
                      </button>
                      
                      <button
                        onClick={() => openTypeModal('edit')}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                      >
                        <CarFront size={18} />
                        Jenis Akomodasi
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white text-[#389CA4]">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="font-medium text-gray-900">{item.type}</span>
                          <span className="text-xs text-gray-500">{item.code}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Harga</p>
                          <p className="font-semibold text-teal-600">
                            Rp. {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
            )}
          </div>

          <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
            {showAddMenu && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-56">
                <button
                  onClick={openAddModal}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  <Map size={18} />
                  Perjalanan Destinasi
                </button>

                <button
                  onClick={() => openTypeModal('add')}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  <CarFront size={18} />
                  Jenis Akomodasi
                </button>
              </div>
            )}

            <button
              onClick={handleAddAccommodation}
              className="w-14 h-14 bg-[#389CA4] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2F8C93] transition"
            >
              <Plus size={26} />
            </button>
          </div>

          {showDestinationModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[500px] rounded-xl shadow-xl p-7 relative">
                <button
                  className="absolute right-4 top-4"
                  onClick={() => setShowDestinationModal(false)}
                >
                  <X size={22} />
                </button>

                <h2 className="text-xl font-semibold mb-6">
                  {modalMode === 'add' ? 'Tambahkan Akomodasi' : 'Edit Akomodasi'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">Destinasi</p>
                    <div ref={dropdownRef} className="relative w-full">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between bg-gray-200 border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                      >
                        <span>{selectedDestination}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                          {destinationOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSelectedDestination(opt);
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

                  <div>
                    <p className="text-sm font-semibold mb-3">Pilih Transportasi</p>
                    <div className="space-y-3">
                      {transportOptions.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-2 items-center">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={(e) => updateTransport(index, 'checked', e.target.checked)}
                                className="w-4 h-4 accent-[#389CA4]"
                              />
                            </label>

                            <input
                              type="text"
                              value={item.type}
                              readOnly
                              className="bg-gray-200 rounded-md px-3 py-2 text-sm w-1/2 outline-none border border-gray-300"
                            />

                            <input
                              type="text"
                              placeholder="Rp. 0"
                              value={item.price}
                              onChange={(e) => updateTransport(index, 'price', e.target.value)}
                              className="bg-gray-200 rounded-md px-3 py-2 text-sm w-1/2 outline-none border border-gray-300 focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Detail transportasi"
                            value={item.detail}
                            onChange={(e) => updateTransport(index, 'detail', e.target.value)}
                            className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm outline-none border border-gray-300 focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-[#389CA4] text-white py-2 rounded-full"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        if (modalMode === 'edit' && editingDestination) {
                          handleDeleteDestination(editingDestination);
                        } else {
                          handleReset();
                        }
                      }}
                        className={`flex-1 text-white py-2 rounded-full transition
                          ${modalMode === 'edit'
                            ? 'bg-[#A43838] hover:bg-[#8F2E2E]'
                            : 'bg-black hover:bg-gray-900'}`}
                      >
                      {modalMode === 'edit' ? 'Hapus' : 'Bersihkan'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showTypeModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-[500px] rounded-xl shadow-xl p-7 relative">
                <button
                  className="absolute right-4 top-4"
                  onClick={() => setShowTypeModal(false)}
                >
                  <X size={22} />
                </button>

                <h2 className="text-xl font-semibold mb-6">
                  Tambahkan Tipe Akomodasi
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm mb-1">ID Kendaraan</p>
                    <input
                      type="text"
                      placeholder="AKM005"
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-1">Tipe Transportasi</p>
                    <input
                      type="text"
                      placeholder="...."
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-1">Harga /Orang</p>
                    <input
                      type="text"
                      placeholder="....."
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(e.target.value)}
                      className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        console.log("Saved Type:", { vehicleId, vehicleType, vehiclePrice });
                        setShowTypeModal(false);
                      }}
                      className="flex-1 bg-[#389CA4] text-white py-2 rounded-full"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setVehicleId('');
                        setVehicleType('');
                        setVehiclePrice('');
                      }}
                        className={`flex-1 text-white py-2 rounded-full transition
                          ${modalMode === 'edit'
                            ? 'bg-[#A43838] hover:bg-[#8F2E2E]'
                            : 'bg-black hover:bg-gray-900'}`}
                      >
                      {modalMode === 'edit' ? 'Hapus' : 'Bersihkan'}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}