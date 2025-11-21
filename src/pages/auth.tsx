import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dummyUsers = [
  { email: "test@trava.com", password: "test123", fullName: "test" },
  { email: "kyy@trava.com", password: "kyy123", fullName: "Kyy" }
];

export default function TravaAuth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid.";
    }

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap tidak boleh kosong.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password tidak boleh kosong.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (!isLogin) {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi.";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Password tidak cocok.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isLogin) {
      const foundUser = dummyUsers.find(
        (d) => d.email === formData.email && d.password === formData.password
      );

      if (!foundUser) {
        setErrors({ general: "Email atau password salah!" });
        return;
      }

      localStorage.setItem('isAuth', 'true');
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: foundUser.fullName,
          email: foundUser.email
        })
      );

      alert(`Login berhasil! Welcome, ${foundUser.fullName}`);
      navigate('/dashboard');
    } else {
      alert("Registrasi berhasil! Silakan login.");
      setIsLogin(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
      });
      setErrors({});
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth');
    if (isAuth) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className={`${isLogin ? 'order-2' : 'order-1'} lg:w-1/2 relative`}>
        <img
          src="../../beach.png"
          alt=""
          className={`
            absolute inset-0 m-auto object-contain w-[98%] h-[98%]
            ${isLogin ? "translate-x-[-50px]" : "translate-x-[50px]"}
          `}
        />
      </div>

      <div className={`${isLogin ? 'order-1' : 'order-2'} w-full lg:w-1/2 flex items-center justify-center p-8 bg-white`}>
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 justify-center">
            <img src='/public/travaLogo.png' />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Heal your burnout here' : 'Start your journey'}
          </h1>

          <div className="space-y-4">

            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#389CA4]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {errors.general && (
              <p className="text-red-500 text-center text-sm">{errors.general}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-[#389CA4] text-white font-semibold py-3 rounded-[16px] shadow-lg"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6 text-center text-gray-600">
            {isLogin ? (
              <p>
                Not registered yet?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                  }}
                  className="text-[#389CA4] font-semibold"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                  }}
                  className="text-[#389CA4] font-semibold"
                >
                  Login here
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
