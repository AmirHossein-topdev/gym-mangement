"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  ChevronDown,
} from "lucide-react";

export default function Header({ onOpenSidebar }) {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 mb-3 py-4 bg-[#1a1d23]/50 backdrop-blur-md border border-gray-800 rounded-[2rem] sticky top-4 z-50 shadow-2xl transition-all duration-500 hover:border-yellow-400/30">
      {/* سمت چپ: کنترل موبایل و تایتل سیستم */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-3 bg-yellow-400 text-black rounded-xl hover:scale-95 transition-transform"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={3} />
        </button>

        <div className="flex flex-col">
          <h2 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-50 leading-none">
            Command Center
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="hidden md:block text-xl font-black italic text-white uppercase tracking-tighter">
              پنل <span className="text-yellow-400">مدیریت کل</span>
            </span>
          </div>
        </div>
      </div>

      {/* سمت راست: نوتیفیکیشن و پروفایل فلاح */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* نوتیفیکیشن‌های سیستمی */}
        <div className="relative hidden sm:block">
          <button className="p-3 bg-gray-800/50 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 rounded-2xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* بخش پروفایل VIP */}
        <div ref={profileRef} className="relative">
          <div
            className="flex items-center gap-4 p-1 pr-4 bg-gray-900/80 border border-gray-800 rounded-full cursor-pointer hover:border-yellow-400/50 transition-all group shadow-lg"
            onClick={() => setShowProfileInfo(!showProfileInfo)}
          >
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-white font-black italic text-sm tracking-tight group-hover:text-yellow-400 transition-colors">
                امیرحسین فلاح
              </span>
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-end">
                General Manager{" "}
                <ShieldCheck size={10} className="text-yellow-400" />
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                width={48}
                height={48}
                alt="Admin"
                className="rounded-full border-2 border-yellow-400 relative z-10 grayscale-[50%] group-hover:grayscale-0 transition-all"
                unoptimized
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1a1d23] rounded-full z-20"></div>
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-500 transition-transform duration-300 ${
                showProfileInfo ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* دراپ‌دان منو - به سبک فلاح */}
          {showProfileInfo && (
            <div className="absolute left-0 lg:right-0 mt-4 bg-[#1a1d23] border border-gray-800 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-56 animate-in fade-in zoom-in duration-200 z-50">
              <div className="p-3 border-b border-gray-800 mb-2">
                <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">
                  وضعیت عملیاتی
                </p>
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase italic">
                  <Zap size={12} fill="currentColor" /> Ready for Training
                </div>
              </div>

              <div className="space-y-1 text-right">
                <button className="w-full flex items-center justify-end gap-3 p-3 text-gray-400 hover:bg-yellow-400 hover:text-black rounded-xl transition-all text-sm font-bold italic">
                  تنظیمات امنیتی <Settings size={16} />
                </button>
                <button className="w-full flex items-center justify-end gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-bold italic border border-transparent hover:border-red-400/20">
                  خروج از مرکز فرماندهی <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
