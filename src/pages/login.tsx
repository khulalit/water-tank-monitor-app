import { Droplet, EyeIcon, EyeOff, HelpCircle, LogIn } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  // Inside your LoginPage component:
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userVal, setUserVal] = useState("");
  const [keyVal, setKeyVal] = useState("");

  const handleLogin = () => {
    if (userVal && keyVal) {
      login(userVal, keyVal);
      navigate("/");
    }
  };

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] font-sans min-h-screen flex flex-col items-center justify-start text-white">
      <div className="relative flex h-full min-h-screen w-full max-w-[430px] flex-col bg-[#f6f7f8] dark:bg-[#101822] overflow-x-hidden border-x border-gray-200 dark:border-gray-800 shadow-2xl">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="text-[#2b7cee] flex size-12 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined text-3xl">
              <Droplet />
            </span>
          </div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Tank Monitor
          </h2>
        </div>

        <div className="px-0 sm:px-4 sm:py-3">
          <div className="w-full bg-gradient-to-br from-[#2b7cee]/30 to-[#101822] flex flex-col justify-end overflow-hidden bg-[#101822] sm:rounded-lg min-h-[200px] relative">
            <div className="absolute inset-0 opacity-20">
              <svg
                height="100%"
                viewBox="0 0 1000 1000"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0,500 C150,400 350,600 500,500 C650,400 850,600 1000,500 L1000,1000 L0,1000 Z"
                  fill="#2b7cee"
                ></path>
              </svg>
            </div>
            <div className="p-6 relative z-10">
              <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">
                Welcome back
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                Manage your water resources efficiently
              </p>
            </div>
          </div>
        </div>

        <div className="h-6 bg-transparent"></div>

        <div className="px-4 flex-1 flex flex-col">
          <div className="space-y-4">
            <div className="flex flex-col">
              <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
                Username
              </p>
              <input
                className="flex w-full rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#2b7cee] border border-gray-200 dark:border-[#3b4554] bg-white dark:bg-[#1c2027] h-14 placeholder:text-gray-400 dark:placeholder:text-[#9da8b9] p-[15px] text-base transition-all"
                placeholder="Enter your username"
                type="text"
                value={userVal}
                onChange={(e) => setUserVal(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
                API Key
              </p>
              <div className="flex w-full items-stretch rounded-lg">
                <input
                  className="flex w-full flex-1 rounded-l-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#2b7cee] border border-gray-200 dark:border-[#3b4554] bg-white dark:bg-[#1c2027] h-14 placeholder:text-gray-400 dark:placeholder:text-[#9da8b9] p-[15px] border-r-0 pr-2 text-base transition-all"
                  placeholder="Enter your API Key"
                  type={showPassword ? "text" : "password"}
                  value={keyVal}
                  onChange={(e) => setKeyVal(e.target.value)}
                />
                <div className="text-gray-400 dark:text-[#9da8b9] flex border border-gray-200 dark:border-[#3b4554] bg-white dark:bg-[#1c2027] items-center justify-center pr-[15px] rounded-r-lg border-l-0">
                  <span
                    className="material-symbols-outlined cursor-pointer hover:text-[#2b7cee] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <EyeIcon />}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start px-1 pt-2 pb-6">
            <a
              className="text-[#2b7cee] text-sm font-medium hover:underline flex items-center gap-1"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">
                <HelpCircle />
              </span>
              Where to find my API Key?
            </a>
          </div>

          <div className="py-4">
            <button
              className="w-full bg-[#2b7cee] hover:bg-[#2b7cee]/90 text-white font-bold h-14 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              onClick={handleLogin}
            >
              Login
              <span className="material-symbols-outlined">
                <LogIn />
              </span>
            </button>
          </div>

          <div className="mt-auto py-10 flex flex-col items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Don't have an account yet?
            </p>
            <button className="text-gray-900 dark:text-white font-semibold py-2 px-6 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Request Access
            </button>
          </div>
        </div>

        <div className="w-full h-1 bg-[#2b7cee]/20">
          <div className="h-full bg-[#2b7cee] w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
