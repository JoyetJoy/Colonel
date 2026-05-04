import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { basicXFormRequest } from "../api";
import { LOGIN } from "../api/apis";
import useAuthStore from "../store/UseAuthStore";
import ErrorPopup from "./popups/ErrorPopup";
import { usePopup } from "../providers/PopupProvider";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = usePopup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("coloneltoken");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    const data = {
      email,
      password
    }

    try {
      setLoading(true);
      const res = await basicXFormRequest.post(LOGIN, data);
      if (res?.data?.status) {
        setLoading(false);
        console.log(res);

        const token = res.data?.data?.accessToken;
        const userData = res.data?.data;
        localStorage.setItem("coloneltoken", token);

        useAuthStore.getState().login({
          user: userData,
          role: "user",
        });

        toast.success("Login successful");
        setEmail('');
        setPassword('');
        console.log('enter')
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrormsg(error?.response?.data?.error || "Something went wrong");
      setErrorPopup(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex">
      <ErrorPopup
        popupOpen={errorPopup}
        setPopupOpen={setErrorPopup}
        setError={setErrormsg}
        error={errormsg}
      />
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          {/* Decorative lines */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Shield Icon */}
          <div className="mx-auto mb-8 w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.1)]">
            <Shield className="w-14 h-14 text-black" />
          </div>

          <h1 className="text-4xl text-white mb-3 tracking-tight">
            Colonel Security
          </h1>
          <p className="text-lg text-white/40 mb-10">Management System</p>

          {/* Feature highlights */}
          <div className="space-y-4 text-left">
            {[
              {
                title: "Employee Management",
                desc: "Register, allocate, and track security personnel",
              },
              {
                title: "Payroll & Billing",
                desc: "Automated salary processing with GST billing",
              },
              {
                title: "Real-time Reports",
                desc: "Attendance, duty logs, and financial analytics",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/80">{item.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <p className="absolute bottom-8 text-xs text-white/20">
          Version 5.0 &mdash; Colonel Security Platform
        </p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mb-4">
              <Shield className="w-9 h-9 text-black" />
            </div>
            <h1 className="text-2xl text-white">Colonel Security</h1>
            <p className="text-sm text-white/40">Management System</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl text-white">Welcome back</h2>
            <p className="text-sm text-white/40 mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@colonel.com"
                  className="w-full h-12 pl-11 pr-4 bg-white/[0.04] rounded-xl text-sm text-white placeholder:text-white/20 border border-white/[0.08] focus:border-white/25 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 bg-white/[0.04] rounded-xl text-sm text-white placeholder:text-white/20 border border-white/[0.08] focus:border-white/25 outline-none transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded accent-white bg-transparent border-white/20"
                />
                <span className="text-xs text-white/40">Remember me</span>
              </label>
              <button
                type="button"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white cursor-pointer text-black rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <p className="text-[11px] text-white/30 mb-2">Demo Credentials</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">
                  superadmin@colonel.com
                </p>
                <p className="text-xs text-white/50">password123</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail("superadmin@colonel.com");
                  setPassword("password123");
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/70 border border-white/[0.08] transition-colors"
              >
                Fill
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] text-white/15">
            &copy; 2026 Colonel Security System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
