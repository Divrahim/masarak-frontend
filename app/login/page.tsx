
import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل دخولك لحسابك التعليمي في مسار.",
};

export default function LoginPage() {
  return (
    <main className="page-container auth-page">
      <div className="breadcrumbs">
        <Link href="/">الرئيسية</Link>
        <span>/</span>
        <span>تسجيل الدخول</span>
      </div>

      <AuthForm mode="login" />
    </main>
  );
}
