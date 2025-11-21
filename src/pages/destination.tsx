import { useState, useRef, useEffect } from "react";
import { MapPin, User, Edit, Trash2, Plus, Upload, X, ChevronDown } from "lucide-react";
import Sidebar from "../components/sideBar";
import HeaderPage from "../components/header";

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  visitor: number;
  price: number;
  image: string;
}

export default function Destination() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [destinations, setDestinations] = useState<Destination[]>([
    { id: 1, name: "Pulau Seribu", description: "Lorem ipsum...", location: "Jakarta", visitor: 50, price: 150000, image: "../../public/beach.png" },
    { id: 2, name: "Pulau Seribu", description: "Lorem ipsum...", location: "Jakarta", visitor: 50, price: 150000, image: "../../public/beach.png" },
    { id: 3, name: "Pulau Seribu", description: "Lorem ipsum...", location: "Jakarta", visitor: 100, price: 150000, image: "../../public/beach.png" },
    { id: 4, name: "Pulau Seribu", description: "Lorem ipsum...", location: "Jakarta", visitor: 1, price: 150000, image: "../../public/beach.png" },
    { id: 5, name: "Pulau Seribu", description: "Lorem ipsum...", location: "Jakarta", visitor: 99, price: 150000, image: "../../public/beach.png" },
  ]);

  const transportOptions = ["Mobil", "Bis", "Pesawat", "Kapal", "Motor", "Kereta"];
  const jenisOptions = ["Pantai","Gunung","Wisata Alam","Wisata Kota","Sejarah","Budaya","Kuliner","Theme Park","Edukasi"];

  const [form, setForm] = useState({
    id: 0,
    name: "",
    description: "",
    location: "",
    type: "Pantai",
    transportation: [] as string[],
    price: "",
    image: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransportChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      transportation: prev.transportation.includes(value)
        ? prev.transportation.filter((t) => t !== value)
        : [...prev.transportation, value],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    setPreviewImage(imgURL);
  };

  const handleReset = () => {
    setForm({ id: 0, name: "", description: "", location: "", type: "Pantai", transportation: [], price: "", image: "" });
    setPreviewImage(null);
  };

  const handleSave = () => {
    if (form.id === 0) {
      const newDest: Destination = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        location: form.location,
        visitor: 0,
        price: parseInt(form.price),
        image: previewImage || "../../public/beach.png",
      };
      setDestinations(prev => [...prev, newDest]);
    } else {
      setDestinations(prev => prev.map(d => d.id === form.id ? {
        ...d,
        name: form.name,
        description: form.description,
        location: form.location,
        price: parseInt(form.price),
        image: previewImage || d.image,
      } : d));
    }
    setOpenModal(false);
    handleReset();
  };

  const handleEdit = (dest: Destination) => {
    setForm({
      id: dest.id,
      name: dest.name,
      description: dest.description,
      location: dest.location,
      type: "Pantai",
      transportation: [],
      price: dest.price.toString(),
      image: dest.image
    });
    setPreviewImage(dest.image);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus destinasi ini?")) {
      setDestinations(prev => prev.filter(d => d.id !== id));
      if (form.id === id) handleReset();
    }
  };

  const handleAddDestination = () => {
    handleReset();
    setOpenModal(true);
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

  const filteredDestinations = destinations.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const name = "Mame Tidumbe";
  const role = "Admin";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 overflow-auto">
        <HeaderPage
          title="Destinasi"
          subtitle="Kelola Destinasi"
          name={name}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showSearch={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {openModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[850px] rounded-xl shadow-xl p-7 relative">
              <button className="absolute right-4 top-4" onClick={() => setOpenModal(false)}><X size={22} /></button>
              <h2 className="text-xl font-semibold mb-6">{form.id === 0 ? "Tambahkan Destinasi baru" : "Edit Destinasi"}</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">Nama Destinasi</p>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-200 p-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]" placeholder="......" />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Deskripsi</p>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-gray-200 p-2 rounded-md h-28 outline-none border border-gray-300 focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]" placeholder="......" />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Lokasi</p>
                    <input name="location" value={form.location} onChange={handleChange} className="w-full bg-gray-200 p-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]" placeholder="......" />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Jenis Destinasi</p>
                    <div ref={dropdownRef} className="relative w-full">
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between bg-gray-200 border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]">
                        <span>{form.type}</span>
                        <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                          {jenisOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setForm(prev => ({ ...prev, type: opt })); setIsDropdownOpen(false); }}
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
                    <p className="text-sm mb-2">Transportasi</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {transportOptions.map(item => (
                        <label key={item} className="flex items-center gap-2 bg-gray-200 p-2 rounded-md cursor-pointer hover:bg-gray-300">
                          <input
                            type="checkbox"
                            checked={form.transportation.includes(item)}
                            onChange={() => handleTransportChange(item)}
                            className="w-4 h-4 accent-[#389CA4]"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-1">Harga /Orang</p>
                    <input name="price" value={form.price} onChange={handleChange} className="w-full bg-gray-200 p-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]" placeholder="......" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm mb-2">Upload foto</p>
                  <label className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-[310px] cursor-pointer">
                    {previewImage ? <img src={previewImage} className="w-full h-full object-cover rounded-xl" /> :
                    <div className="text-center text-gray-500">
                      <Upload size={40} className="mx-auto mb-2" />
                      <p>upload file dengan tipe PNG/JPG</p>
                    </div>}
                    <input type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" onChange={handleImageUpload} />
                  </label>
                  <div className="flex gap-3 mt-6">
                    {form.id === 0 ? (
                      <>
                        <button onClick={handleSave} className="flex-1 bg-[#389CA4] text-white py-2 rounded-full">Simpan</button>
                        <button onClick={handleReset} className="flex-1 bg-black text-white py-2 rounded-full">Bersihkan</button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleSave} className="flex-1 bg-[#389CA4] text-white py-2 rounded-full">Simpan Perubahan</button>
                        <button onClick={() => handleDelete(form.id)} className="flex-1 bg-[#A43838] text-white py-2 rounded-full">Hapus</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {filteredDestinations.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-20 text-lg">
                Destinasi tidak tersedia
              </div>
            ) : (
              filteredDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-3">{destination.description}</p>
                  <div className="flex flex-col gap-1 mb-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{destination.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{destination.visitor} orang</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Harga /orang</p>
                      <p className="font-semibold text-[#389CA4] text-xl">Rp. {destination.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-1 h-full">
                      <button onClick={() => handleEdit(destination)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit className="w-4 h-4 text-[#303030]" /></button>
                      <button onClick={() => handleDelete(destination.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-[#A43838]" /></button>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          <button onClick={handleAddDestination} className="fixed bottom-8 right-8 w-14 h-14 bg-[#389CA4] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2F8C93] transition">
            <Plus size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}
