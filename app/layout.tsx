
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Compass } from "lucide-react";

import "./globals.css";
import { LearningProgressProvider } from "@/components/learning-progress-provider";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "مسارك | ابدأ رحلتك بثقة",
    template: "%s | مسارك",
  },
  description:
    "مسارك منصة تساعدك على تعلم هندسة الويب، وبناء مهاراتك العملية، والاستعداد لسوق العمل بخريطة تعلم واضحة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Suspense
          fallback={
            <header
              className="site-header"
              aria-label="جاري تحميل القائمة"
            />
          }
        >
          <SiteHeader />
        </Suspense>

        <main>
          <Suspense
            fallback={
              <div className="page-container">
                جاري تحميل الصفحة...
              </div>
            }
          >
            <LearningProgressProvider>
              {children}
            </LearningProgressProvider>
          </Suspense>
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <Link href="/" className="brand footer-brand">
              <span className="brand-mark">
                <Compass size={19} />
              </span>
              <span>
                مسارك<span className="brand-period">.</span>
              </span>
            </Link>

            <p>
              طريق أوضح من التعلم إلى التطبيق.
            </p>

            <span>
              صُممت لمساعدة الجيل القادم من المطورين.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
