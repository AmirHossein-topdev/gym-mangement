"use client";

import React, { useState } from "react";
import {
  useGetOwnersQuery,
  useDeleteOwnerMutation,
} from "../../../redux/features/ownerApi";
import {
  Edit3,
  Trash2,
  Plus,
  Search,
  ArrowRight,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Zap,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../layout";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:7000";

// کارت مربیان برای موبایل - سبک کلاب فلاح
const OwnerCard = ({ owner, index, handleDelete }) => {
  const isActive = owner.status === "active";

  return (
    <div className="bg-[#1a1d23] p-5 rounded-3xl border border-gray-800 hover:border-yellow-400/40 transition-all duration-300 shadow-xl group">
      <div className="flex justify-between items-start mb-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {owner.photo ? (
              <img
                src={`${BASE_URL}${owner.photo}`}
                alt={owner.name}
                className="w-14 h-14 object-cover rounded-2xl border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-gray-800 text-yellow-400 rounded-2xl border-2 border-gray-700 text-xl font-black">
                {owner.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-black text-white group-hover:text-yellow-400 transition-colors tracking-tighter">
              {owner.name}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
              {owner.type === "individual" ? (
                <User size={10} />
              ) : (
                <Building2 size={10} />
              )}
              {owner.type === "individual" ? "Personal" : "Corporate"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
            isActive
              ? "bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          {isActive ? "PRO / ACTIVE" : "INACTIVE"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-y-3 text-[13px] text-gray-400">
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-yellow-400" />
          <span className="font-mono">
            ID: {owner.nationalId || owner.orgId || "---"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-yellow-400" />
          <span>{owner.phone || "---"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-yellow-400" />
          <span className="truncate">{owner.email || "---"}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-800/50">
        <Link
          href={`/dashboard/owners/${owner._id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-yellow-400 hover:text-black text-white p-2.5 rounded-xl text-xs transition-all font-black uppercase italic"
        >
          <Edit3 size={14} /> Edit
        </Link>
        <button
          onClick={() => handleDelete(owner._id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-900/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl text-xs transition-all font-black uppercase italic border border-red-900/30"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default function OwnersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetOwnersQuery();
  const [deleteOwner] = useDeleteOwnerMutation();

  const owners = Array.isArray(data) ? data : data?.data?.owners || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "تایید حذف مربی",
      text: "آیا از حذف این مربی از دیتابیس باشگاه اطمینان دارید؟",
      icon: "warning",
      background: "#1a1d23",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#374151",
      confirmButtonText: "بله، حذف قطعی",
      cancelButtonText: "لغو",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteOwner(id).unwrap();
        Swal.fire({
          title: "حذف شد!",
          icon: "success",
          background: "#1a1d23",
          color: "#fff",
          confirmButtonColor: "#facc15",
        });
        refetch();
      } catch (err) {
        Swal.fire("خطا", "مشکلی در حذف مربی رخ داد", "error");
      }
    }
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.nationalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-yellow-400 font-black animate-pulse">
          <Zap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری لیست مربیان VIP...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 min-h-screen bg-[#0f1115] rounded-[2.5rem] border border-gray-800 shadow-2xl shadow-black/50">
        {/* Header - Falah Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-3 bg-gray-800 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all rounded-2xl shadow-lg"
            >
              <ArrowRight size={24} />
            </Link>
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                مدیریت <span className="text-yellow-400 text-4xl">مربیان</span>
              </h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-1">
                Owner & Investor Directory
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/owners/create"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-[0_10px_20px_rgba(250,204,21,0.2)] active:scale-95 italic uppercase"
          >
            <Plus size={20} strokeWidth={3} /> افزودن مربی جدید
          </Link>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative group">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، کد ملی، شماره تماس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1d23] border border-gray-800 text-white rounded-2xl p-4 pr-14 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all shadow-inner font-bold"
          />
          <Search
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors"
            size={22}
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-hidden bg-[#1a1d23] rounded-[2rem] border border-gray-800 shadow-2xl">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-[11px] uppercase tracking-[0.2em] border-b border-gray-700">
                <th className="py-6 px-6 font-black">Rank</th>
                <th className="py-6 px-6 font-black">Identity</th>
                <th className="py-6 px-6 font-black">Code</th>
                <th className="py-6 px-6 font-black">Contact</th>
                <th className="py-6 px-6 font-black">Type</th>
                <th className="py-6 px-6 font-black text-center">Status</th>
                <th className="py-6 px-6 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOwners.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-20 text-gray-600 font-bold italic text-xl"
                  >
                    🔍 مربیی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner, index) => (
                  <tr
                    key={owner._id}
                    className="hover:bg-yellow-400/5 transition-colors group"
                  >
                    <td className="py-5 px-6 font-mono text-gray-500 text-xs">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        {owner.photo ? (
                          <img
                            src={`${BASE_URL}${owner.photo}`}
                            className="w-11 h-11 rounded-xl object-cover border border-gray-700 group-hover:border-yellow-400 transition-colors"
                            alt=""
                          />
                        ) : (
                          <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center text-yellow-400 font-bold border border-gray-700">
                            {owner.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-200 group-hover:text-white transition-colors">
                            {owner.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono tracking-tighter">
                            {owner.email || "No Email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-gray-400 font-mono text-[12px]">
                      {owner.nationalId || owner.orgId || "---"}
                    </td>
                    <td className="py-5 px-6 text-gray-400 text-[12px]">
                      {owner.phone || "---"}
                    </td>
                    <td className="py-5 px-6">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800 w-fit">
                        {owner.type === "individual" ? (
                          <User size={12} />
                        ) : (
                          <Building2 size={12} />
                        )}
                        {owner.type}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black tracking-tighter ${
                          owner.status === "active"
                            ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                            : "bg-gray-800 text-gray-500 border border-gray-700"
                        }`}
                      >
                        {owner.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/owners/${owner._id}/edit`}
                          className="p-2.5 bg-gray-800 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(owner._id)}
                          className="p-2.5 bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden grid grid-cols-1 gap-4">
          {filteredOwners.map((owner, index) => (
            <OwnerCard
              key={owner._id}
              owner={owner}
              index={index}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
