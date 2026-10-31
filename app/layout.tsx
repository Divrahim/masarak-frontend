import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";

import "./globals.css";
import { LearningProgressProvider } from "@/components/learning-progress-provider";
import SiteHeader, {
  type HeaderSession,
} from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "مسارك | ابدأ رحلتك بثقة",
    template: "%s | مسارك",
  },
  description:
    "مسارك منصة تساعدك على تعلم هندسة الويب، وبناء مهاراتك العملية، والاستعداد لسوق العمل بخريطة تعلم واضحة.",
};

/* Presentation-only read of the demo session cookie so the header can
   show the signed-in state. Auth logic itself stays untouched. */
async function SiteHeaderWithSession() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get("masarak-demo-session")?.value;

  let session: HeaderSession = null;

  if (rawSession) {
    try {
      const parsed: unknown = JSON.parse(rawSession);

      if (
        parsed &&
        typeof parsed === "object" &&
        typeof (parsed as { displayName?: unknown }).displayName === "string"
      ) {
        session = {
          displayName: (parsed as { displayName: string }).displayName,
        };
      }
    } catch {
      session = null;
    }
  }

  return <SiteHeader session={session} />;
}

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
          <SiteHeaderWithSession />
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
            <Link href="/" className="footer-brand">
              <Image
                src="/masarak-logo-transparent.png"
                alt="مسارك MASARAK"
                width={200}
                height={62}
                className="footer-brand-logo"
              />
            </Link>

            <p>طريق أوضح من التعلم إلى التطبيق.</p>

            <span></span>
          </div>
        </footer>
      </body>
    </html>
  );
}