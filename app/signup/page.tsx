
import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "اعمل حسابك التعليمي في مسار.",
};

export default function SignupPage() {
  return (
    <main className="page-container auth-page">
      <div className="breadcrumbs">
        <Link href="/">الرئيسية</Link>
        <span>/</span>
        <span>إنشاء حساب</span>
      </div>

      <AuthForm mode="signup" />
    </main>
  );
}
