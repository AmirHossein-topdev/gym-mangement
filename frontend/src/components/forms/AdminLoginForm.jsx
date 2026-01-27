"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Shield, Dumbbell, Coffee, User, Eye, EyeOff } from "lucide-react";

import { notifyError, notifySuccess } from "@/utils/toast";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import ErrorMsg from "../common/error-msg";

const ROLES = [
  {
    key: "user",
    label: "اعضا",
    icon: <User size={16} />,
    accent: "yellow",
    redirect: "/users-dashboard",
  },
  {
    key: "coach",
    label: "مربی",
    icon: <Dumbbell size={16} />,
    accent: "green",
    redirect: "/trainers-dashboard",
  },
  {
    key: "admin",
    label: "مدیر باشگاه",
    icon: <Shield size={16} />,
    accent: "blue",
    redirect: "/manager-dashboard",
  },
  {
    key: "cafe",
    label: "مدیر کافه",
    icon: <Coffee size={16} />,
    accent: "orange",
    redirect: "/manager-dashboard/cafe",
  },
];

const ACCENT_CLASSES = {
  yellow: {
    bg: "bg-yellow-400",
    hover: "hover:bg-yellow-500",
    text: "text-black",
    shadow: "shadow-yellow-400/30",
  },
  blue: {
    bg: "bg-blue-400",
    hover: "hover:bg-blue-600",
    text: "text-black",
    shadow: "shadow-blue-500/30",
  },
  green: {
    bg: "bg-green-500",
    hover: "hover:bg-green-600",
    text: "text-black",
    shadow: "shadow-green-500/30",
  },
  orange: {
    bg: "bg-orange-500",
    hover: "hover:bg-orange-600",
    text: "text-black",
    shadow: "shadow-orange-500/30",
  },
};

export default function UnifiedLoginForm() {
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [showPass, setShowPass] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const schema = Yup.object({
    employeeCode: Yup.string()
      .required("شناسه ورود الزامی است")
      .matches(/^[0-9]{4,15}$/, "فرمت شناسه نامعتبر است"),
    password: Yup.string()
      .required("رمز عبور الزامی است")
      .min(6, "حداقل ۶ کاراکتر"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!captchaValue) {
      notifyError("تأیید کپچا الزامی است");
      return;
    }

    try {
      // 1️⃣ لاگین کاربر
      const response = await loginUser({
        employeeCode: data.employeeCode,
        password: data.password,
        role: activeRole.key,
      }).unwrap();

      // فرض می‌کنیم response.user شامل اطلاعات کاربر است
      const user = response.user;

      if (!user) {
        notifyError("اطلاعات کاربر دریافت نشد");
        return;
      }

      // 2️⃣ ذخیره امن در sessionStorage (با JSON.stringify)
      const safeUser = {
        _id: user._id,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        email: user.email,
        employeeCode: user.employeeCode,
      };

      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));

      // 3️⃣ لاگ برای دیباگ
      console.log("✅ Current User Stored:", safeUser);

      // 4️⃣ نمایش پیام موفقیت
      notifySuccess(`ورود موفق | ${activeRole.label}`);

      // 5️⃣ ریدایرکت بعد از ذخیره کاربر
      router.replace(activeRole.redirect);
    } catch (err) {
      notifyError(err?.data?.message || "ورود ناموفق");
      console.error("Login error:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0f1115] px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-[#1a1d23] border border-gray-800 rounded-[2.5rem] shadow-2xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black italic text-white">
            سیستم <span className="text-yellow-400">ورود نئون</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">
            Tactical Access Control
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {ROLES.map((role) => (
            <button
              key={role.key}
              type="button"
              onClick={() => {
                setActiveRole(role);
                reset();
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black italic transition-all
                ${
                  activeRole.key === role.key
                    ? `bg-${role.accent}-400 text-black shadow-lg scale-105`
                    : "bg-[#0f1115] text-gray-500 border border-gray-800 hover:border-gray-600"
                }`}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register("employeeCode")}
              placeholder="شناسه ورود"
              className="w-full bg-[#0f1115] border border-gray-800 rounded-xl py-4 px-4 text-white font-bold focus:outline-none focus:border-yellow-400"
            />
            <ErrorMsg msg={errors.employeeCode?.message} />
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="رمز عبور"
              className="w-full bg-[#0f1115] border border-gray-800 rounded-xl py-4 px-4 text-white font-bold focus:outline-none focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <ErrorMsg msg={errors.password?.message} />
          </div>

          {/* CAPTCHA */}
          <div className="flex justify-center scale-90">
            <ReCAPTCHA
              sitekey="6LdnLyAsAAAAANcQ13SwbVVzuOhdHmjmbDiyGnkK"
              onChange={(val) => setCaptchaValue(val)}
              hl="fa"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl font-black italic transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${ACCENT_CLASSES[activeRole.accent].bg}
              ${ACCENT_CLASSES[activeRole.accent].hover}
              ${ACCENT_CLASSES[activeRole.accent].text}
              ${ACCENT_CLASSES[activeRole.accent].shadow}
              shadow-lg
            `}
          >
            {isLoading
              ? "در حال احراز..."
              : `ورود به عنوان ${activeRole.label}`}
          </button>
        </form>
      </div>
    </div>
  );
}
