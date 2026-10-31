
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
        Back to starting options
      </Link>

      <header className="quiz-header">
        <span className="eyebrow">
          Initial skills assessment
        </span>

        <h1>Let's find your starting point</h1>

        <p>
          Answer based on what you can confidently explain
          or do. Your CV is optional and is not treated as
          proof that you have mastered a skill.
        </p>
      </header>

      <PlacementAssessmentClient />
    </div>
  );
}
