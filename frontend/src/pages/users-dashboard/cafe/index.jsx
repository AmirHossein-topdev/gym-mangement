"use client";

import React, { useState } from "react";
import {
  Coffee,
  Beef,
  Zap,
  Apple,
  Droplets,
  Flame,
  Target,
  Search,
} from "lucide-react";
import DashboardLayout from "../layout";

export default function CafeMenuPage() {
  const [activeCategory, setActiveCategory] = useState("همه");

  const categories = [
    { id: 1, name: "همه", icon: <Target size={18} /> },
    { id: 2, name: "پروتئین", icon: <Beef size={18} /> },
    { id: 3, name: "نوشیدنی", icon: <Droplets size={18} /> },
    { id: 4, name: "انرژی‌زا", icon: <Zap size={18} /> },
    { id: 5, name: "میان وعده", icon: <Apple size={18} /> },
    { id: 6, name: "قهوه", icon: <Coffee size={18} /> },
  ];

  const products = [
    // --- دسته پروتئین (تامین مهمات عضلانی) ---
    {
      id: 101,
      category: "پروتئین",
      name: "شیک وی ایزوله (بمب پروتئین)",
      price: 185000,
      img: "https://images.unsplash.com/photo-1593095183571-2d5ff1e46358?q=80&w=500",
      kcal: 240,
    },
    {
      id: 106,
      category: "پروتئین",
      name: "اوتمیل کره بادام‌زمینی",
      price: 110000,
      img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=500",
      kcal: 380,
    },
    {
      id: 107,
      category: "پروتئین",
      name: "سینه مرغ گریل (رژیمی)",
      price: 210000,
      img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500",
      kcal: 320,
    },

    // --- دسته نوشیدنی (خنک‌کننده یگان) ---
    {
      id: 102,
      category: "نوشیدنی",
      name: "اسموتی سبز دتاکس",
      price: 95000,
      img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=500",
      kcal: 120,
    },
    {
      id: 108,
      category: "نوشیدنی",
      name: "آب معدنی ایزوتونیک (آبی)",
      price: 45000,
      img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=500",
      kcal: 50,
    },

    // --- دسته انرژی‌زا (پیشران عملیات) ---
    {
      id: 103,
      category: "انرژی‌زا",
      name: "معجون رد-لاین فلاح",
      price: 140000,
      img: "https://images.unsplash.com/photo-1622484210800-26d2588e3d8c?q=80&w=500",
      kcal: 310,
    },
    {
      id: 109,
      category: "انرژی‌زا",
      name: "شات قبل تمرین (Pre-Workout)",
      price: 85000,
      img: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=500",
      kcal: 10,
    },

    // --- دسته میان وعده (تجهیزات همراه) ---
    {
      id: 104,
      category: "میان وعده",
      name: "فیله استیک گریل (تک‌اور)",
      price: 290000,
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
      kcal: 450,
    },
    {
      id: 110,
      category: "میان وعده",
      name: "پروتئین بار دست‌ساز",
      price: 75000,
      img: "https://images.unsplash.com/photo-1610450541541-38146747d25e?q=80&w=500",
      kcal: 210,
    },
    {
      id: 111,
      category: "میان وعده",
      name: "ماست یونانی و عسل",
      price: 90000,
      img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500",
      kcal: 180,
    },

    // --- دسته قهوه (استارت موتور) ---
    {
      id: 105,
      category: "قهوه",
      name: "دبل اسپرسو نئون",
      price: 65000,
      img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=500",
      kcal: 5,
    },
    {
      id: 112,
      category: "قهوه",
      name: "آیس کافی کُلد برو",
      price: 125000,
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500",
      kcal: 15,
    },
  ];

  const filteredProducts =
    activeCategory === "همه"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <DashboardLayout>
      <div
        className="p-4 md:p-8 min-h-screen rounded-4xl bg-[#0f1115] text-right"
        dir="rtl"
      >
        {/* Header & Cart Summary */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              کافه <span className="text-yellow-400">نئون</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black mt-3 flex items-center gap-2 uppercase tracking-[0.4em]">
              <Flame size={14} className="text-yellow-400" /> TACTICAL REFUELING
              STATION
            </p>
          </div>
        </div>

        {/* Categories Bar - اسکرول شونده در موبایل */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-10 border-b border-gray-800/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black italic text-xs md:text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.name
                  ? "bg-yellow-400 text-black scale-105 shadow-lg shadow-yellow-400/20"
                  : "bg-[#1a1d23] text-gray-500 border border-gray-800 hover:border-gray-600"
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 group max-w-md">
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="جستجوی سریع سوخت..."
            className="w-full bg-[#1a1d23] border border-gray-800 rounded-2xl py-4 pr-12 pl-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-400 transition-all italic"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#1a1d23] border border-gray-800 rounded-[2rem] overflow-hidden group hover:border-yellow-400/50 transition-all duration-500 shadow-xl"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black italic flex items-center gap-1">
                  <Flame size={12} className="text-orange-500" /> {product.kcal}{" "}
                  KCAL
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d23] via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">
                    {product.category}
                  </p>
                  <span className="text-gray-600 font-mono text-[10px]">
                    #{product.id}
                  </span>
                </div>
                <h3 className="text-white font-black italic text-lg mb-4 group-hover:text-yellow-400 transition-colors">
                  {product.name}
                </h3>

                <div className="flex justify-between items-center mt-auto border-t border-gray-800 pt-4">
                  <div className="text-right">
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">
                      قیمت واحد:
                    </p>
                    <span className="text-white font-black text-xl italic">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-[10px] mr-2">
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#1a1d23] rounded-[3rem] border-2 border-dashed border-gray-800">
            <div className="text-gray-700 mb-4 flex justify-center">
              <Coffee size={48} />
            </div>
            <p className="text-gray-500 font-black italic uppercase">
              موردی در این دسته یافت نشد یگان!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
