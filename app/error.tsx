"use client";

/* Route-segment error boundary (frontend only).
   Catches rendering/runtime errors inside the app subtree and offers a
   retry via reset(). It does NOT intercept server actions, event-handler
   errors, or backend logic — those keep their existing behavior. */

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the failure observable in devtools; no backend reporting exists yet.
    console.error(error);
  }, [error]);

  return (
    <div className="page-container mas-state-page">
      <section className="panel mas-state-card">
        <span className="mas-state-code" dir="ltr">
          <TriangleAlert size={34} />
        </span>

        <h1>حصلت مشكلة في عرض الصفحة</h1>

        <p>
          مش مشكلة من عندك — جرّب تاني، ولو المشكلة استمرت ارجع
          للرئيسية وتابع رحلتك من لوحة التحكم.
        </p>

        <div className="dashboard-actions">
          <button
            type="button"
            className="button-primary"
            onClick={reset}
          >
            <RefreshCw size={17} />
            جرّب تاني
          </button>

          <Link href="/" className="button-secondary">
            الرئيسية
            <ArrowLeft size={17} />
          </Link>
        </div>

        {error?.digest && (
          <p className="stat-note" dir="ltr" style={{ textAlign: "end" }}>
            ref: {error.digest}
          </p>
        )}
      </section>
    </div>
  );
}
