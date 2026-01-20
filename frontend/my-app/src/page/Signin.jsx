import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import heroShoe from "../assets/hero-shoe.png";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "IDENTITY REQUIRED";
    if (!form.email.includes("@")) newErrors.email = "INVALID PROTOCOL ADDRESS";
    if (form.password.length < 8) {
      newErrors.password = "KEY MUST BE 8+ SYMBOLS";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "CAPITAL REQUIREMENT FAILED";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "LOWERCASE REQUIREMENT FAILED";
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "NUMERIC REQUIREMENT FAILED";
    } else if (!/[@#$%&*]/.test(form.password)) {
      newErrors.password = "SYMBOL REQUIREMENT FAILED";
    }
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "KEY MISMATCH DETECTED";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateSignup();
    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const newUser = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        };

        const response = await axiosInstance.post(`/users`, newUser);
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("currentUser", JSON.stringify(user));

        toast.success("Identity established");
        setForm({ fullName: "", email: "", password: "", confirmPassword: "" });

        navigate("/");
        window.location.reload();
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          if (err.response.data.message === "User already exists") {
            setError({ email: "IDENTITY ALREADY ARCHIVED" });
          } else {
            toast.error(err.response.data.message);
          }
        } else {
          toast.error("Registration error. Protocol failure.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden selection:bg-cyan-500/30 px-6 py-24">
      {/* Cinematic Background Glows */}
      <div className="fixed top-0 right-1/4 w-[1000px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[1000px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">

        {/* Brand/Information Side */}
        <div className="hidden lg:flex flex-col justify-between p-20 relative overflow-hidden bg-white/[0.02] border-r border-white/5 group/panel">
          {/* Background Image with Mask */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroShoe}
              alt="Elite Performance"
              className="w-full h-full object-cover scale-150 -translate-x-1/4 translate-y-1/4 grayscale brightness-[0.2] group-hover/panel:grayscale-0 group-hover/panel:brightness-[0.4] transition-all duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
          </div>

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-10" />

          <div className="space-y-8 relative z-20">
            <div className="flex items-center gap-3 text-purple-500 text-[10px] font-black uppercase tracking-[0.5em]">
              <Sparkles className="w-3 h-3" />
              New Lifeform Protocol
            </div>
            <h2 className="text-8xl font-thin text-white uppercase tracking-tighter leading-none italic">
              JOIN THE <br />
              <span className="font-black not-italic tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/30 text-8xl md:text-9xl">ELITE</span>
            </h2>
            <div className="flex items-center gap-4 py-8 border-y border-white/5">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <ShieldCheck className="w-6 h-6 text-cyan-500" />
              </div>
              <p className="max-w-[200px] text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                SECURE YOUR SPOT IN THE SOVEREIGN COLLECTION.
              </p>
            </div>
          </div>

          <div className="space-y-2 relative z-20">
            <p className="text-[10px] text-gray-600 font-black tracking-[0.4em] uppercase">COLLECTION ACCESS</p>
            <p className="text-2xl font-thin text-white uppercase tracking-[0.1em]">THE ARCHIVE 2.0</p>
          </div>
        </div>

        {/* Form Container Side */}
        <div className="p-10 md:p-20 flex flex-col justify-center">
          <div className="mb-14">
            <h1 className="text-4xl font-thin text-white uppercase tracking-widest leading-none mb-3">NEW <span className="font-black italic">IDENTITY</span></h1>
            <div className="h-[1px] w-12 bg-cyan-500 mb-4" />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Establish your credentials</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase ml-4">Full Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-cyan-500 transition-colors" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="ARCHIVE_SUBJECT_01"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-5 text-[10px] font-black tracking-[0.4em] text-white placeholder-gray-800 transition-all focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_40px_rgba(6,182,212,0.1)]"
                />
              </div>
              {error.fullName && (
                <p className="text-red-500 text-[8px] font-black tracking-[0.2em] uppercase ml-4 mt-2">!! {error.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase ml-4">Email </label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-cyan-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="SUBJECT.01@VAULT.NET"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-5 text-[10px] font-black tracking-[0.4em] text-white placeholder-gray-800 transition-all focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_40px_rgba(6,182,212,0.1)]"
                />
              </div>
              {error.email && (
                <p className="text-red-500 text-[8px] font-black tracking-[0.2em] uppercase ml-4 mt-2">!! {error.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase ml-4">password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-cyan-500 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="ACCESS_KEY"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-5 text-[10px] font-black tracking-[0.4em] text-white placeholder-gray-800 transition-all focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08]"
                  />
                </div>
                {error.password && (
                  <p className="text-red-500 text-[8px] font-black tracking-[0.1em] uppercase ml-4 mt-2 max-w-xs">{error.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase ml-4">Verify password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-cyan-500 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="VERIFY_KEY"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-5 text-[10px] font-black tracking-[0.4em] text-white placeholder-gray-800 transition-all focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08]"
                  />
                </div>
                {error.confirmPassword && (
                  <p className="text-red-500 text-[8px] font-black tracking-[0.2em] uppercase ml-4 mt-2">{error.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full group relative py-6 bg-white text-black rounded-2xl overflow-hidden transition-all duration-700 hover:bg-cyan-500 hover:text-white shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.6em]">
                signin
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>

            <div className="mt-14 text-center">
              <p className="text-[10px] text-gray-600 font-bold tracking-[0.3em] uppercase mb-4">Identity already established?</p>
              <Link
                to="/login"
                className="inline-block text-[11px] font-black text-white uppercase tracking-[0.5em] border-b border-white/10 hover:border-cyan-500 hover:text-cyan-500 transition-all pb-1"
              >
                login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
