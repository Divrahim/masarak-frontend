
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Route,
  Sparkles,
} from "lucide-react";

import { curriculum } from "@/lib/curriculum";
import { useLearningProgress } from "@/components/learning-progress-provider";

const statusLabels = {
  completed: "مكتملة",
  current: "المرحلة الحالية",
  locked: "مقفولة",
} as const;

function formatDuration(duration: string) {
  const match = duration.match(/^(\d+)\s+weeks?$/i);

  if (!match) return duration;

  const weeks = Number(match[1]);

  if (weeks === 1) return "أسبوع واحد";
  if (weeks === 2) return "أسبوعان";
  return `${weeks} أسابيع`;
}

export default function RoadmapClient() {
  const { completedModuleIds, getStatus, hydrated } =
    useLearningProgress();

  if (!hydrated) {
    return (
      <div className="page-container roadmap-loading" dir="rtl">
        <p className="stat-note">
          جاري تحميل تقدمك في المسار...
        </p>
      </div>
    );
  }

  const completedCount = completedModuleIds.length;
  const progress = Math.round(
    (completedCount / curriculum.length) * 100
  );

  const currentModule = curriculum.find(
    (item) => getStatus(item.id) === "current"
  );

  const stages = curriculum.map((item) => ({
    ...item,
    status: getStatus(item.id),
  }));

  return (
    <div className="page-container roadmap-page" dir="rtl">
      <section className="roadmap-heading">
        <div className="roadmap-heading-content">
          <span className="roadmap-eyebrow">
            <Route size={15} />
            رحلتك التعليمية
          </span>

          <h1>
            رحلتك في <span>هندسة الويب</span>
          </h1>

          <p>
            من أول خطوة في عالم الويب، لحد ما تبني مشاريع
            حقيقية وتكون مستعد لسوق العمل.
            <br />
            كل مرحلة بتقربك من هدفك.
          </p>
        </div>

        <div
          className="roadmap-heading-decoration"
          aria-hidden="true"
        >
          <Sparkles size={28} />
        </div>
      </section>

      <section className="roadmap-progress-card">
        <div className="roadmap-progress-main">
          <div className="roadmap-progress-title">
            <span className="roadmap-progress-icon">
              <Route size={20} />
            </span>

            <div>
              <h2>تقدمك في المسار</h2>
              <p>استمر، كل خطوة بتفرق!</p>
            </div>
          </div>

          <div className="roadmap-progress-percentage">
            <strong>{progress}%</strong>
            <span>نسبة الإنجاز</span>
          </div>
        </div>

        <div
          className="roadmap-progress-track"
          role="progressbar"
          aria-label="نسبة التقدم في المسار"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="roadmap-progress-footer">
          <span>
            <strong>{curriculum.length}</strong>
            إجمالي المراحل
          </span>

          <span>
            <strong>{completedCount}</strong>
            مراحل مكتملة
          </span>

          <span>
            <strong>
              {currentModule ? currentModule.number : "—"}
            </strong>
            المرحلة الحالية
          </span>
        </div>
      </section>

      <section className="roadmap-stages-section">
        <div className="roadmap-section-heading">
          <div>
            <span className="roadmap-section-eyebrow">
              خطوات رحلتك
            </span>

            <h2>محطات المسار</h2>

            <p>
              اتعلم، طبّق، واجتاز الاختبار عشان تفتح المرحلة اللي بعدها.
            </p>
          </div>

          <span className="roadmap-stage-count">
            {curriculum.length} مراحل
          </span>
        </div>

        <div className="roadmap-timeline">
          {stages.map((item) => {
            const status = item.status;

            const StatusIcon =
              status === "completed"
                ? CheckCircle2
                : status === "current"
                  ? ArrowLeft
                  : LockKeyhole;

            return (
              <article
                className={`roadmap-stage roadmap-stage-${status}`}
                key={item.id}
              >
                <div className="roadmap-stage-marker">
                  {status === "completed" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <span>{item.number}</span>
                  )}
                </div>

                <Link
                  href={`/roadmap/${item.id}`}
                  className="roadmap-stage-card"
                  aria-label={`عرض المرحلة ${item.number}: ${item.title}`}
                >
                  <div className="roadmap-stage-top">
                    <span className={`roadmap-status ${status}`}>
                      <StatusIcon size={14} />
                      {statusLabels[status]}
                    </span>

                    <span className="roadmap-stage-duration">
                      <Clock3 size={14} />
                      {formatDuration(item.duration)}
                    </span>
                  </div>

                  <div className="roadmap-stage-body">
                    <div className="roadmap-stage-content">
                      <h3 dir="ltr">{item.title}</h3>

                      <p dir="ltr">{item.description}</p>

                      <div
                        className="roadmap-stage-skills"
                        dir="ltr"
                      >
                        {item.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    </div>

                    <span className="roadmap-stage-arrow">
                      <ArrowLeft size={19} />
                    </span>
                  </div>

                  {status === "current" && (
                    <div className="roadmap-stage-action">
                      <span>ابدأ أو استكمل المرحلة</span>
                      <ArrowLeft size={17} />
                    </div>
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <p className="roadmap-note">
        يتم حفظ تقدمك في هذا المتصفح. اجتياز اختبار كل مرحلة
        يفتح لك المرحلة التالية.
      </p>
    </div>
  );
}
