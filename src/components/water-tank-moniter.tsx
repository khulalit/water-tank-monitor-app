import { BellIcon, CloudSync, Droplet } from "lucide-react";
import React, { useState } from "react";

interface TankProps {
  levelPercent?: number; // 0 to 100
  currentVolume?: number; // liters (from backend)
  isAlive?: boolean;
  lastUpdated?: number;
}

const WaterTankMonitor: React.FC<TankProps> = ({
  levelPercent = 0,
  currentVolume = 0,
  isAlive = false,
  lastUpdated,
}) => {
  const [isAlertEnabled, setIsAlertEnabled] = useState(true);

  const displayPercent = Math.round(levelPercent);
  const displayLiters = Math.round(currentVolume);

  return (
    <div className="font-sans text-white transition-colors duration-200 min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-[#101822] text-white ">
        {/* Header */}
        <header className="flex items-center bg-transparent p-4 pb-2 justify-between z-20">
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Your Water Tank
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors bg-transparent">
              <span className="material-symbols-outlined text-[24px]">
                <CloudSync />
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-8">
          {/* Visual Tank Display */}
          <div className="flex flex-col items-center justify-center pt-6 pb-8 px-6">
            <div className="relative w-72 h-[420px] bg-slate-200 dark:bg-[#1a2634] rounded-[3.5rem] border-[8px] border-white dark:border-[#233040] shadow-2xl overflow-hidden box-content ring-1 ring-slate-900/5 dark:ring-white/5 isolate">
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] rounded-[3rem] z-20 pointer-events-none" />

              <div
                className="absolute inset-0 opacity-10 pointer-events-none z-0"
                style={{
                  backgroundImage:
                    "radial-gradient(#6b7280 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="absolute right-0 top-16 bottom-16 w-12 flex flex-col justify-between items-end pr-5 pointer-events-none z-30 opacity-50">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      i % 4 === 0 ? "w-5" : "w-2.5"
                    } h-0.5 bg-slate-400 dark:bg-white rounded-full`}
                  />
                ))}
              </div>

              {/* Dynamic Water Level */}
              <div
                className="absolute bottom-0 left-0 right-0 z-10 transition-all duration-1000 ease-in-out"
                style={{ height: `${displayPercent}%` }}
              >
                <svg
                  className="absolute -top-[18px] w-full h-[24px] text-[#2b7cee] dark:text-blue-600 opacity-60 transform scale-x-[-1]"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M0 10 V 5 Q 25 12 50 5 T 100 5 V 10 z"
                    fill="currentColor"
                  ></path>
                </svg>

                <svg
                  className="absolute -top-[18px] w-full h-[24px] text-[#4fa3ff] dark:text-[#3b82f6]"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M0 10 V 5 Q 25 0 50 5 T 100 5 V 10 z"
                    fill="currentColor"
                  ></path>
                </svg>

                <div className="h-full w-full bg-gradient-to-b from-[#4fa3ff] to-[#2b7cee] dark:from-[#3b82f6] dark:to-[#1d4ed8]">
                  <div className="absolute bottom-12 left-8 w-2 h-2 bg-white/20 rounded-full blur-[1px]" />
                  <div className="absolute bottom-24 right-12 w-3 h-3 bg-white/10 rounded-full blur-[1px]" />
                  <div className="absolute bottom-48 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full blur-[0.5px]" />
                </div>
              </div>

              <div className="absolute inset-0 rounded-[3rem] z-40 pointer-events-none bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-70" />

              {/* Level Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
                <div className="flex flex-col items-center drop-shadow-md">
                  <h1 className="text-white text-7xl font-extrabold tracking-tighter leading-none">
                    {displayPercent}
                    <span className="text-4xl align-top ml-1 opacity-90">
                      %
                    </span>
                  </h1>
                  <p className="text-blue-50 dark:text-blue-100 font-medium text-lg mt-2 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 shadow-sm text-slate-800">
                    ~{displayLiters.toLocaleString()} L
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Alert Card */}
          <div className="px-6 pb-6">
            <button
              onClick={() => setIsAlertEnabled(!isAlertEnabled)}
              className="w-full bg-white dark:bg-[#1a2634] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between group active:scale-[0.99] transition-all"
            >
              {/* unchanged */}
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">
                    <BellIcon />
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-slate-900 dark:text-white font-bold text-base">
                    Tank Alerts
                  </h3>
                  <p className="text-slate-500 text-sm group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    {isAlertEnabled ? "Notifications On" : "Notifications Off"}
                  </p>
                </div>
              </div>
              <div
                className={`relative w-14 h-8 rounded-full transition-colors shadow-inner ${
                  isAlertEnabled
                    ? "bg-blue-500"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`absolute top-1 bg-white size-6 rounded-full shadow-sm transition-all duration-200 ${
                    isAlertEnabled ? "right-1" : "left-1"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Stats Card */}
          <div className="px-6 space-y-4">
            <div className="bg-white dark:bg-[#1a2634] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined">
                    <Droplet />
                  </span>
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-base">
                    Tank Capacity
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Total volume available
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-[#111820] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">
                    Current Fill
                  </p>
                  <p className="text-slate-900 dark:text-white text-xl font-bold">
                    {displayLiters.toLocaleString()} L
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WaterTankMonitor;
