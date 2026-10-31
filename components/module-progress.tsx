
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Target,
} from "lucide-react";
import { useLearningProgress } from "@/components/learning-progress-provider";

export function ModuleProgressBadge({ moduleId }: { moduleId: string }) {
  const { hydrated, getStatus } = useLearningProgress();

  if (!hydrated) {
    return (
      <span className="status-pill">
        <Loader2 size={14} />
        جاري تحميل الحالة...
      </span>
    );
  }

  const status = getStatus(moduleId);

  return (
    <span className={`status-pill ${status}`}>
      {status === "completed" ? (
        <CheckCircle2 size={14} />
      ) : status === "current" ? (
        <Target size={14} />
      ) : (
        <LockKeyhole size={14} />
      )}

      {status === "completed"
        ? "مكتملة"
        : status === "current"
          ? "جاهزة للتعلم"
          : "مقفولة — لازم تكمّل المتطلبات"}
    </span>
  );
}

export function ModuleQuizAction({ moduleId }: { moduleId: string }) {
  const { hydrated, getStatus } = useLearningProgress();

  if (!hydrated) {
    return null;
  }

  const status = getStatus(moduleId);

  if (status === "locked") {
    return (
      <section className="panel detail-section">
        <h2>اختبار المرحلة</h2>
        <p>
          لازم تجتاز اختبارات المتطلبات الأول. المرحلة هتتفتح لما تكمّل
          متطلباتها.
        </p>
        <Link href="/roadmap" className="button-secondary">
          افتح خريطة المسار <ArrowLeft size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section className="panel detail-section">
      <h2>اختبار المرحلة</h2>
      <p>
        اختبر فهمك باختبار قصير. الاجتياز بيوثّق المرحلة كمكتملة وبيفتح
        المرحلة اللي بعدها.
      </p>

      <Link
        href={`/roadmap/${moduleId}/quiz`}
        className="button-primary"
        style={{ width: "100%", marginTop: 12 }}
      >
        {status === "completed" ? "راجع الاختبار" : "ابدأ اختبار المرحلة"}
        <ArrowLeft size={16} />
      </Link>
    </section>
  );
}
