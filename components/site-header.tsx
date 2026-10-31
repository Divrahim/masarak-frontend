"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, LogOut } from "lucide-react";
import {
  Home,
  LayoutDashboard,
  Map,
} from "lucide-react";

import { signOutAction } from "@/app/auth/actions";

const navigation = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/roadmap", label: "خريطة المسار", icon: Map },
  {
    href: "/dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
  },
];

export type HeaderSession = {
  displayName: string;
} | null;

export default function SiteHeader({
  session,
}: {
  session?: HeaderSession;
}) {
  const pathname = usePathname();

  return (
    <header className="site-header" dir="rtl">
      <div className="nav-container">
        <Link
          href="/"
          className="brand"
          aria-label="مسارك - الصفحة الرئيسية"
        >
          <Image
            src="/masarak-logo-transparent.png"
            alt="مسارك MASARAK"
            width={240}
            height={74}
            priority
            className="site-brand-logo"
          />
        </Link>

        <nav className="main-nav" aria-label="القائمة الرئيسية">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${
                  isActive ? "is-active" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="header-auth-actions">
          {session ? (
            <>
              <Link
                href="/profile"
                className="header-user-chip"
                aria-label={`ملف ${session.displayName} الشخصي`}
              >
                <CircleUserRound size={19} strokeWidth={1.8} />
                <span className="header-user-name">
                  {session.displayName}
                </span>
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="header-signout"
                  aria-label="تسجيل الخروج من حسابك"
                >
                  <LogOut size={15} strokeWidth={1.8} />
                  <span>خروج</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="button-secondary">
                تسجيل الدخول
              </Link>

              <Link href="/signup" className="button-primary">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}