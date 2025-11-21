import { useState } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import Sidebar from "../components/sideBar";
import HeaderPage from "../components/header";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [form, setForm] = useState({
    name: "Mame Telozenia",
    email: "mamet34@gmail.com",
    password: "************",
    role: "Admin"
  });

  const [originalForm, setOriginalForm] = useState(form);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleSave = () => {
    setOriginalForm(form);
    setOriginalImage(imagePreview);
    alert("Perubahan berhasil disimpan!");
  };

  const handleCancel = () => {
    setForm(originalForm);
    setImagePreview(originalImage);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 overflow-auto">
        <HeaderPage
          title="Profil Anda"
          name={form.name}
          role={form.role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-8">

          <div className="flex flex-col items-center mb-10">
            <img
              src={imagePreview || "/profile.png"}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover"
            />

            <h2 className="text-xl font-semibold mt-4">{form.name}</h2>
            <p className="text-gray-500 text-sm">{form.role}</p>
          </div>

          <hr className="my-6 border-[#389CA4]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <div>
              <h3 className="text-lg font-semibold mb-4">Data Diri Anda</h3>

              <div className="flex flex-col gap-4">

                <div>
                  <label className="text-sm text-gray-600">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full bg-gray-100 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-gray-100 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Password</label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full bg-gray-100 px-4 py-2 rounded-lg mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <input
                    type="text"
                    value={form.role}
                    readOnly
                    className="w-full bg-gray-100 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
                  />
                </div>

              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-10 mb-4">Edit foto profil</h3>

              <label
                htmlFor="fileUpload"
                className="border-2 border-dashed border-gray-300 rounded-xl h-80 flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:bg-gray-100 transition"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <Camera className="w-12 h-12 mb-4 text-gray-500" />
                    <p className="text-sm">upload foto (PNG/JPG)</p>
                  </>
                )}
              </label>

              <input
                id="fileUpload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-10 justify-end">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-[#389CA4] text-white hover:bg-[#2f878d]"
            >
              Simpan Perubahan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}