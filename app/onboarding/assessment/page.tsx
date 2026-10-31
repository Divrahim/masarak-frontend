
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PlacementAssessmentClient from "@/components/placement-assessment-client";

export default function PlacementAssessmentPage() {
  return (
    <div className="page-container">
      <Link
        href="/onboarding"
        className="text-link inline-flex items-center gap-2"
      >
        <ArrowLeft size={17} />
        رجوع لخيارات البداية
      </Link>

      <header className="quiz-header">
        <span className="eyebrow">
          تقييم المهارات الأولي
        </span>

        <h1>هنحدد نقطة بدايتك</h1>

        <p>
          جاوب على أساس اللي تقدر تشرحه أو تعمله بثقة. الـCV اختياري
          ومش بيتحسب كدليل إنك أتقنت مهارة.
        </p>
      </header>

      <PlacementAssessmentClient />
    </div>
  );
}
