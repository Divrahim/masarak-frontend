import Link from "next/link";
import { LayoutDashboard, Map } from "lucide-react";

const navigation = [
  {
    href: "/roadmap",
    label: "خريطة المسار",
    icon: Map,
  },
  {
    href: "/dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
  },
];

export default function SiteHeader() {
  return (
    <header className="site-header" dir="rtl">
      <div className="nav-container">

        {/* Brand */}
        <Link
          href="/"
          className="brand"
          aria-label="مسارك - الصفحة الرئيسية"
        >
          <span className="brand-mark">
            <svg
              viewBox="0 0 48 48"
              width="30"
              height="30"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 29 C8 19 16 18 19 27 C22 36 27 32 31 26 L43 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="43"
                cy="9"
                r="3.5"
                fill="#E9AA4B"
              />
            </svg>
          </span>

          <span className="brand-name">
            مسارك<span className="brand-period">.</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav
          className="main-nav"
          aria-label="القائمة الرئيسية"
        >
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="nav-link"
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Authentication Links */}
        <div className="header-auth-actions">
          <Link
            href="/login"
            className="button-secondary"
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/signup"
            className="button-primary"
          >
            إنشاء حساب
          </Link>
        </div>

      </div>
    </header>
  );
}