import { useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import Sidebar from '../components/sideBar';
import HeaderPage from '../components/header';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default function User() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const name = "Mame Tidumbe";
  const role = "Admin";

  const [users, setUsers] = useState<User[]>([
    { id: '00001', name: 'Salmah Nadya Safitri', email: 'example@gmail.com', password: '********' },
    { id: '00002', name: 'Kyy', email: 'kyy@gmail.com', password: '********' },
    { id: '00003', name: 'Andhika', email: 'andhika@gmail.com', password: '********' },
    { id: '00004', name: 'Daffa', email: 'daffa@gmail.com', password: '********' },
    { id: '00005', name: 'Bella', email: 'bella@gmail.com', password: '********' },
    { id: '00006', name: 'Jeremi', email: 'jeremi@gmail.com', password: '********' },
    { id: '00007', name: 'Haidar', email: 'haidar@gmail.com', password: '********' }
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<User>({
    id: '',
    name: '',
    email: '',
    password: ''
  });

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setForm({ id: '', name: '', email: '', password: '' });
    setOpenModal(true);
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (form.id === '') {
      const newUser: User = {
        ...form,
        id: Date.now().toString()
      };
      setUsers(prev => [...prev, newUser]);
    } else {
      setUsers(prev =>
        prev.map(user => (user.id === form.id ? form : user))
      );
    }
    setOpenModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 overflow-auto">

        <HeaderPage
          title="Pengguna"
          subtitle="Kelola user"
          name={name}
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showSearch={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-8">

          <div className="bg-white rounded-2xl shadow-sm border border-[#389CA4] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#389CA4] text-white text-sm">
                  <th className="py-4 px-4 text-center border-r border-white">ID User</th>
                  <th className="py-4 px-4 text-center border-r border-white">Nama pengguna</th>
                  <th className="py-4 px-4 text-center border-r border-white">Email</th>
                  <th className="py-4 px-4 text-center border-r border-white">Password</th>
                  <th className="py-4 px-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      Pengguna tidak tersedia
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-center border-r">{user.id}</td>
                      <td className="py-3 px-4 text-center border-r">{user.name}</td>
                      <td className="py-3 px-4 text-center border-r">{user.email}</td>
                      <td className="py-3 px-4 text-center border-r">{user.password}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center gap-4">
                          <button onClick={() => handleEdit(user)} className="text-gray-600 hover:text-[#389CA4]">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-center gap-2 py-4 bg-white border-t">
              <button
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => changePage(index + 1)}
                  className={`px-3 py-1 border rounded-lg text-sm
                    ${currentPage === index + 1 ? 'bg-[#389CA4] text-white' : 'hover:bg-gray-100'}
                  `}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={handleAdd}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#389CA4] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2F8C93] transition"
        >
          <Plus size={26} />
        </button>

        {/* Modal */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative">
              <button className="absolute right-4 top-4" onClick={() => setOpenModal(false)}>
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-5">
                {form.id === '' ? 'Tambah User' : 'Edit User'}
              </h2>

              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama"
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                />
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#389CA4] focus:border-[#389CA4]"
                />

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#389CA4] text-white py-2 rounded-full"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="flex-1 bg-black text-white py-2 rounded-full"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
