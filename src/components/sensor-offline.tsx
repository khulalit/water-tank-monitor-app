import { ArrowLeft, WifiOff } from "lucide-react";
import React from "react";

interface SensorOfflineProps {
  onBack?: () => void;
}

const SensorOffline: React.FC<SensorOfflineProps> = ({ onBack }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#101822] text-white dark:bg-background-dark font-display  dark:text-white transition-colors duration-300">
      <div className="flex items-center p-4 pb-2 justify-between safe-top">
        <div
          onClick={onBack}
          className=" dark:text-white flex size-12 shrink-0 items-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">
            <ArrowLeft />
          </span>
        </div>
        <h2 className=" dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Tank Status
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          <div className="relative w-64 h-64 flex items-center justify-center bg-primary/10 dark:bg-primary/5 rounded-full">
            <div
              className="bg-center bg-no-repeat aspect-square bg-contain w-48 h-48"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7STHrmcCaF9Y7mYv5RysD5tqioKyO5HTgDfawKeX9nEAscGuFVknWS0PbYErpYjFhdxLcovMrQxLejjD0uyFnnd19zzxn6Kl3v_0n1QFD--YyYfo9W94In00sSEJA8hBG2EuxXfTSoOGTNgXx_koiA85kC6vog32bBFwG-wnlnwCvnlJk7oUkMho4jFleBe94h4WFxxl_FFkOZvyO0nXVRWXtD8e4aV8laOlDul6Ehgx_Om1XRgtdoZRbojyDQYh_8hww46_v5HE")',
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-3 shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">
                <WifiOff />
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight text-center">
              Sensor is Offline
            </h1>
            <p className=" dark:text-gray-400 text-base font-normal leading-relaxed text-center max-w-[320px]">
              We can't show the data right now. Please check your connection or
              sensor status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorOffline;
