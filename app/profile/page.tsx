
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ملفي الشخصي",
};

export default function ProfilePage() {
  // بيانات تجريبية للواجهة فقط
  const displayName = "Student";
  const email = "student@example.com";
  const startPathLabel = "لسه متحددش";
  const hasSelectedPath = false;

  return (
    <div className="page-container">
      <div className="page-heading">
        <span className="eyebrow">حسابك</span>

        <h1>ملفي الشخصي</h1>

        <p>
          راجع بيانات حسابك وادِر رحلتك التعليمية.
        </p>
      </div>

      <section className="panel p-6">
        <h2 className="text-xl font-semibold">
          بيانات الحساب
        </h2>

        <div className="mt-6 grid gap-5">
          <div>
            <p className="text-sm text-gray-500">
              الاسم بالكامل
            </p>
            <p className="font-medium">{displayName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              البريد الإلكتروني
            </p>
            <p className="font-medium" dir="ltr" style={{ textAlign: "end" }}>
              {email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              مسار البداية
            </p>
            <p className="font-medium">{startPathLabel}</p>
          </div>
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="text-xl font-semibold">
          رحلتك التعليمية
        </h2>

        <p className="mt-2 text-gray-500">
          مسارك التعليمي لسه قابل للتخصيص. تقدر تراجع خريطتك
          أو تعيد تقييم مهاراتك الحالية.
        </p>

        <div className="dashboard-actions mt-5">
          <Link
            href="/dashboard"
            className="button-primary"
          >
            افتح لوحة التحكم
          </Link>

          <Link
            href="/onboarding/assessment"
            className="button-secondary"
          >
            قيّم مهاراتك
          </Link>

          {!hasSelectedPath && (
            <Link
              href="/onboarding"
              className="button-secondary"
            >
              اختار مسار البداية
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
