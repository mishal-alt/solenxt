import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import heroShoe from "../assets/hero-shoe.png";
import axiosInstance from "../services/axiosInstance";
import { toast } from 'react-toastify';

const LoginForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    const admin = localStorage.getItem("adminUser");
    if (user) navigate("/");
    if (admin) navigate("/admin/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!form.email.trim() || !form.email.includes("@")) {
      newErrors.email = "Invalid archive identity";
    }
    if (form.password.length < 8) newErrors.password = "Access key incomplete";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email: form.email,
        password: form.password,
      });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (user.isBlock) {
        setErrors({ general: "Protocol restricted. Account decommissioned." });
        toast.error("Protocol restricted. Account decommissioned.");
        return;
      }

      if (user.isAdmin) {
        localStorage.setItem("adminUser", JSON.stringify(user));
        toast.success("Command access granted");
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success("Identity verified");
        navigate("/");
      }

      window.dispatchEvent(new Event("storage"));
      window.location.reload();
    } catch (err) {
      console.error(err);
      setErrors({ general: "Verification failed. Check credentials." });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden selection:bg-cyan-500/30 px-6 py-20">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[800px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 bg-black/40 backdrop-blur-2xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">

        {/* Visual Brand Side */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r border-white/5 group/panel">
          {/* Background Image with Mask */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroShoe}
              alt="The Grail"
              className="w-full h-full object-cover scale-150 translate-x-1/4 -translate-y-1/4 grayscale brightness-[0.2] group-hover/panel:grayscale-0 group-hover/panel:brightness-[0.4] transition-all duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          </div>

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-10" />

          <div className="space-y-6 relative z-20">
            <div className="flex items-center gap-3 text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em]">
              <Sparkles className="w-3 h-3" />
              Archive Protocols
            </div>
            <h2 className="text-7xl font-thin text-white uppercase tracking-tighter leading-none italic">
              THE <span className="font-black not-italic tracking-[0.05em]">VAULT</span>
            </h2>
            <p className="max-w-xs text-gray-500 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
              ACCESS THE RAREST SILHOUETTES IN THE KNOWN UNIVERSE. IDENTITY VERIFICATION REQUIRED.
            </p>
          </div>

          <div className="pt-20 border-t border-white/5 relative z-20">
            <p className="text-[10px] text-gray-600 font-black tracking-[0.3em] uppercase mb-4">SYSTEM STATUS</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan] animate-pulse" />
              <span className="text-[10px] text-white font-bold tracking-widest uppercase">ENCRYPTION ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-black/10">
          <div className="mb-12">
            <h1 className="text-4xl font-thin text-white uppercase tracking-widest mb-2">USER <span className="font-black italic">ACCESS</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Initialize your session</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase ml-4"> Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="IDENT@SOLEXT.NET"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-5 text-[10px] font-black tracking-[0.2em] text-white placeholder-gray-800 transition-all focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[8px] font-black tracking-widest uppercase ml-4 mt-2">!! {errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase ml-4">password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-500" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-5 text-[10px] font-black tracking-[0.2em] text-white placeholder-gray-800 transition-all focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                />
              </div>
              {errors.password && <p className="text-red-500 text-[8px] font-black tracking-widest uppercase ml-4 mt-2">!! {errors.password}</p>}
            </div>

            {errors.general && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-[10px] font-black text-red-500 text-center tracking-widest uppercase">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full group relative py-6 bg-white text-black rounded-2xl overflow-hidden transition-all duration-500 hover:bg-cyan-500 hover:text-white shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.5em]">
                login
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </span>
            </button>
          </form>

          <div className="mt-12 text-center space-y-4">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">Unregistered entity?</p>
            <Link
              to="/signin"
              className="inline-block text-[10px] font-black text-white uppercase tracking-[0.4em] border-b border-white/10 hover:border-cyan-500 hover:text-cyan-500 transition-all pb-1"
            >
              CREATE NEW IDENTITY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
