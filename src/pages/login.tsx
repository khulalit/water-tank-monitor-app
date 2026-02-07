import {
  Droplet,
  EyeIcon,
  EyeOff,
  Ruler,
  Database,
  User,
  KeyRound,
  Wifi,
} from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [userVal, setUserVal] = useState("");
  const [keyVal, setKeyVal] = useState("");

  const [tankHeight, setTankHeight] = useState("");
  const [tankVolume, setTankVolume] = useState("");
  const [fullGap, setFullGap] = useState("10");

  const handleLogin = () => {
    if (!keyVal || !tankHeight || !tankVolume) return;

    const payload = {
      username: userVal,
      apiKey: keyVal,
      tankHeight: Number(tankHeight),
      tankVolume: Number(tankVolume),
      fullGap: Number(fullGap),
    };

    localStorage.setItem("tank-config", JSON.stringify(payload));

    login(payload);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4 font-sans">
      <div className="relative w-full max-w-[420px] bg-[#101822] rounded-3xl border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-center gap-3 py-6 border-b border-white/10">
          <Droplet className="text-[#2b7cee]" size={34} />
          <h2 className="text-white text-xl font-bold tracking-tight">
            Tank Monitor Setup
          </h2>
        </div>

        {/* HERO */}
        <div className="relative px-6 py-9 bg-gradient-to-br from-[#2b7cee]/25 via-[#101822] to-[#101822]">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1000 1000" width="100%" height="100%">
              <path
                d="M0,500 C150,400 350,600 500,500 C650,400 850,600 1000,500 L1000,1000 L0,1000 Z"
                fill="#2b7cee"
              />
            </svg>
          </div>

          <div className="relative z-10">
            <h1 className="text-white text-3xl font-extrabold">
              Configure Your Tank
            </h1>
            <p className="text-blue-200/70 text-sm mt-1">
              Connect your sensor and tank details
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-5">
          {/* Username */}
          <div>
            <p className="text-sm font-semibold pb-2 text-white/80">
              Username (optional)
            </p>

            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-white/40"
                size={18}
              />
              <input
                className="w-full h-12 rounded-xl bg-[#0b1220] border border-white/10 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-[#2b7cee]"
                placeholder="Enter username"
                value={userVal}
                onChange={(e) => setUserVal(e.target.value)}
              />
            </div>
          </div>

          {/* API KEY */}
          <div>
            <p className="text-sm font-semibold pb-2 text-white">API Key</p>

            <div className="flex">
              <div className="relative flex-1">
                <KeyRound
                  className="absolute left-4 top-3.5 text-white/40"
                  size={18}
                />
                <input
                  className="w-full h-12 rounded-l-xl bg-[#0b1220] border border-white/10 border-r-0 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-[#2b7cee]"
                  placeholder="Enter API Key"
                  type={showPassword ? "text" : "password"}
                  value={keyVal}
                  onChange={(e) => setKeyVal(e.target.value)}
                />
              </div>

              <div
                className="h-12 px-4 rounded-r-xl border border-white/10 bg-[#0b1220] flex items-center cursor-pointer hover:bg-white/5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <EyeIcon />}
              </div>
            </div>
          </div>

          {/* Tank Height */}
          <div>
            <p className="text-sm font-semibold pb-2 text-white">
              Tank Height (cm)
            </p>

            <div className="relative">
              <Ruler
                className="absolute left-4 top-3.5 text-white/40"
                size={18}
              />
              <input
                type="number"
                className="w-full h-12 rounded-xl bg-[#0b1220] border border-white/10 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-[#2b7cee]"
                placeholder="e.g. 120"
                value={tankHeight}
                onChange={(e) => setTankHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Tank Volume */}
          <div>
            <p className="text-sm font-semibold pb-2 text-white">
              Total Volume (Liters)
            </p>

            <div className="relative">
              <Database
                className="absolute left-4 top-3.5 text-white/40"
                size={18}
              />
              <input
                type="number"
                className="w-full h-12 rounded-xl bg-[#0b1220] border border-white/10 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-[#2b7cee]"
                placeholder="e.g. 1000"
                value={tankVolume}
                onChange={(e) => setTankVolume(e.target.value)}
              />
            </div>
          </div>

          {/* Sensor Gap */}
          <div>
            <p className="text-sm font-semibold pb-2 text-white">
              Sensor Offset / Full Gap (cm)
            </p>

            <input
              type="number"
              className="w-full h-12 rounded-xl bg-[#0b1220] border border-white/10 px-4 text-white outline-none focus:ring-2 focus:ring-[#2b7cee]"
              value={fullGap}
              onChange={(e) => setFullGap(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <div className="pt-8">
            <button
              onClick={handleLogin}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2b7cee] to-[#3b82f6] font-bold text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
            >
              <Wifi size={18} />
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
