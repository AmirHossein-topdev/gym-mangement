import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";

const AdminLoginForm = () => {
  // 1. وضعیت برای تشخیص نوع ورود (user یا admin)
  const [loginType, setLoginType] = useState("user"); // 'user' or 'admin'
  const [showPass, setShowPass] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  // 2. تغییر داینامیک اسکیمای اعتبارسنجی بر اساس نوع ورود
  const schema = Yup.object().shape({
    employeeCode: Yup.string()
      .required(
        loginType === "admin"
          ? "لطفا کد سازمانی را وارد کنید"
          : "لطفا شماره عضویت را وارد کنید"
      )
      .matches(/^[0-9]{6,12}$/, "فرمت وارد شده صحیح نیست"),
    password: Yup.string()
      .required("رمز عبور الزامی است")
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // تغییر تب و پاکسازی فرم
  const handleTabChange = (type) => {
    setLoginType(type);
    reset();
  };

  const onSubmit = async (data) => {
    if (!captchaValue) {
      notifyError("لطفاً تأیید کنید که ربات نیستید!");
      return;
    }

    try {
      const res = await loginUser({
        employeeCode: data.employeeCode,
        password: data.password,
        role: loginType, // ارسال نقش به بک‌اِند در صورت نیاز
      }).unwrap();

      notifySuccess(
        `خوش آمدید! ورود به عنوان ${
          loginType === "admin" ? "مدیر" : "عضو"
        } موفقیت‌آمیز بود`
      );
      router.replace(loginType === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      const message = err?.data?.message || "ورود موفق نبود. مجدداً تلاش کنید.";
      notifyError(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      {/* --- بخش انتخاب نوع ورود (Tabs) --- */}
      <div className="flex mb-0 bg-gray-100 p-1 rounded-t-2xl border-b-0">
        <button
          onClick={() => handleTabChange("user")}
          className={`flex-1 py-3 text-sm font-bold rounded-t-xl transition-all ${
            loginType === "user"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ورود اعضا
        </button>
        <button
          onClick={() => handleTabChange("admin")}
          className={`flex-1 py-3 text-sm font-bold rounded-t-xl transition-all ${
            loginType === "admin"
              ? "bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ورود مدیر باشگاه
        </button>
      </div>

      {/* --- فرم اصلی --- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-5 bg-white shadow-2xl p-8 rounded-b-2xl border-t-4 transition-colors duration-500 ${
          loginType === "admin" ? "border-indigo-600" : "border-blue-500"
        }`}
      >
        <div className="text-center space-y-2">
          <h2
            className={`text-2xl font-black ${
              loginType === "admin" ? "text-indigo-900" : "text-blue-900"
            }`}
          >
            {loginType === "admin"
              ? "پنل مدیریت مجموعه"
              : "پورتال اعضای باشگاه"}
          </h2>
          <p className="text-xs text-gray-400">اطلاعات حساب خود را وارد کنید</p>
        </div>

        {/* فیلد کد (تغییر لیبل و آیکون به صورت بصری) */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 mr-1">
            {loginType === "admin" ? "کد پرسنلی / سازمانی" : "شماره عضویت"}
          </label>
          <input
            {...register("employeeCode")}
            type="text"
            placeholder={
              loginType === "admin" ? "مثلا: 100200" : "شماره عضویت ۱۰ رقمی"
            }
            className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
              errors.employeeCode
                ? "border-red-500 bg-red-50"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />
          <ErrorMsg msg={errors.employeeCode?.message} />
        </div>

        {/* فیلد رمز عبور */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 mr-1">
            رمز عبور
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                errors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-blue-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <CloseEye /> : <OpenEye />}
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            مرا به خاطر بسپار
          </label>
          <Link href="/forgot" className="text-blue-600 hover:underline">
            فراموشی رمز عبور؟
          </Link>
        </div>

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
          className={`w-full py-3.5 rounded-xl text-white font-bold transition-all transform active:scale-95 shadow-lg disabled:opacity-50 ${
            loginType === "admin"
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
          }`}
        >
          {isLoading
            ? "در حال پردازش..."
            : `ورود به عنوان ${loginType === "admin" ? "مدیر" : "عضو"}`}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
