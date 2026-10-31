
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Compass,
  Loader2,
  Target,
  ClipboardCheck,
} from "lucide-react";
import { Card, ProgressBar } from "@heroui/react";
import { NumberRoll } from "@/components/number-roll";
import { curriculum } from "@/lib/curriculum";
import { useLearningProgress } from "@/components/learning-progress-provider";

/* Presentation-only helper: curriculum durations are English data
   ("1 week" / "2 weeks" / "3 weeks"); this maps them to Arabic for
   display without touching the shared curriculum data. */
function formatDurationAr(duration: string): string {
  const match = /^(\d+)\s+weeks?$/.exec(duration.trim());

  if (!match) {
    return duration;
  }

  const count = Number(match[1]);

  if (count === 1) return "أسبوع";
  if (count === 2) return "أسبوعين";
  return `${count} أسابيع`;
}

export default function DashboardClient() {
  const { completedModuleIds, getStatus, hydrated, loadError } =
    useLearningProgress();

  if (!hydrated) {
    return (
      <div className="page-container">
        <div className="dashboard-loading" role="status">
          <Loader2 size={22} className="dashboard-loading-spinner" />
          <span>بنجهّز بيانات تقدمك...</span>
        </div>
      </div>
    );
  }

  const verifiedModules = curriculum.filter((item) =>
    completedModuleIds.includes(item.id),
  );

  const verifiedCount = verifiedModules.length;

  const progress = Math.round(
    (verifiedCount / curriculum.length) * 100,
  );

  const currentModule = curriculum.find(
    (item) => getStatus(item.id) === "current",
  );

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">مساحة الطالب</span>
          <h1>رحلتك كلها... في لمحة.</h1>
          <p>
            شوف وين واصل، راجع تقدمك، وحدّد خطوتك الجاية.
          </p>
        </div>

        <div className="dashboard-actions">
          <div className="hero-actions">
            <Link href="/roadmap" className="button-primary">
              افتح خريطة المسار
              <ArrowLeft size={17} />
            </Link>

            <Link
              href="/onboarding/assessment"
              className="button-secondary"
            >
              <ClipboardCheck size={17} />
              قيّم مهاراتك
            </Link>
          </div>
        </div>
      </div>

      {loadError && (
        <p className="quiz-validation" role="alert">
          {loadError}
        </p>
      )}

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-label">
            <BookOpen size={17} />
            المراحل الموثّقة
          </div>

          <div className="stat-value">
            <span dir="ltr" className="stat-value-ltr">
              <NumberRoll
                value={verifiedCount}
                from={0}
                duration={1100}
              />
              <span className="stat-note">
                {" "}/ {curriculum.length}
              </span>
            </span>
          </div>

          <div className="stat-note">
            موثّقة عبر التقييم أو اختبارات المراحل
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-label">
            <Target size={17} />
            تقدمك في الخريطة
          </div>

          <div className="stat-value">
            <NumberRoll
              value={progress}
              from={0}
              suffix="%"
              duration={1200}
              dir="ltr"
            />
          </div>

          <ProgressBar
            aria-label="تقدمك في الخريطة"
            value={progress}
            className="dashboard-progress"
          >
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
        </Card>

        <Card className="stat-card">
          <div className="stat-label">
            <Clock3 size={17} />
            تركيزك الحالي
          </div>

          <div className="stat-value" style={{ fontSize: 22 }}>
            {currentModule?.title ?? "كل مراحلك الحالية موثّقة"}
          </div>

          <div className="stat-note">
            {currentModule
              ? `${formatDurationAr(currentModule.duration)} تقديريًا`
              : "راجع الخريطة أو أعِد تقييم مهاراتك."}
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card className="panel">
          <div className="panel-heading">
            <h2>
              {currentModule
                ? "كمّل رحلتك"
                : "راجع مسار تعلّمك"}
            </h2>
            <Compass size={20} color="#173b43" />
          </div>

          {currentModule ? (
            <div className="next-step">
              <span className="status-pill current">
                جاهز للتعلم
              </span>

              <h3>{currentModule.title}</h3>
              <p>{currentModule.description}</p>

              <div
                className="module-meta"
                style={{ marginBottom: 18 }}
              >
                <span>
                  <Clock3
                    size={14}
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  {formatDurationAr(currentModule.duration)}
                </span>

                <span>·</span>
                <span>
                  {currentModule.skills.length} مهارات مستهدفة
                </span>
              </div>

              <Link
                href={`/roadmap/${currentModule.id}`}
                className="button-primary"
              >
                افتح المرحلة الحالية
                <ArrowLeft size={17} />
              </Link>
            </div>
          ) : (
            <div className="next-step">
              <h3>كل مراحلك الحالية موثّقة.</h3>
              <p>
                تقدر تراجع الخريطة المبدئية أو تعيد تقييم
                مهاراتك للتأكد من نقطة بدايتك مرة تانية.
              </p>

              <div className="dashboard-actions">
                <Link href="/roadmap" className="button-primary">
                  راجع الخريطة
                </Link>

                <Link
                  href="/onboarding/assessment"
                  className="button-secondary"
                >
                  أعد تقييم مهاراتك
                </Link>
              </div>
            </div>
          )}
        </Card>

        <Card className="panel">
          <div className="panel-heading">
            <h2>المراحل الموثّقة</h2>
          </div>

          {verifiedModules.length > 0 ? (
            <div className="module-list">
              {[...verifiedModules]
                .reverse()
                .slice(0, 4)
                .map((item) => (
                  <Link
                    href={`/roadmap/${item.id}`}
                    className="resource-card"
                    key={item.id}
                  >
                    <div className="step-icon">
                      <CheckCircle2 size={19} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3>{item.title}</h3>
                      <p>موثّقة عبر اختبار أو تقييم</p>
                    </div>

                    <ArrowLeft size={16} color="#858ba0" />
                  </Link>
                ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                <ClipboardCheck size={21} />
              </div>
              <h3>لسه مفيش مراحل موثّقة</h3>
              <p>
                ابدأ بتركيزك الحالي، أو اعمل تقييم المهارات
                وحدد نقطة بدايتك.
              </p>
            </div>
          )}
        </Card>
      </div>

      <p className="stat-note" style={{ marginTop: 22 }}>
        الخريطة الحالية ومحتوى التقييم مبدئيان، وسيتم تخصيصهما
        لمسارك.
      </p>
    </div>
  );
}
