
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import { curriculum } from "@/lib/curriculum";
import type { ModuleQuiz } from "@/lib/quizzes";
import { useLearningProgress } from "@/components/learning-progress-provider";
import type { QuizSubmissionResult } from "@/lib/learning-progress";

type Props = {
  moduleId: string;
  moduleTitle: string;
  quiz: ModuleQuiz;
};

export default function QuizClient({
  moduleId,
  moduleTitle,
  quiz,
}: Props) {
  const {
    hydrated,
    loadError,
    getStatus,
    recordQuizResult,
    attemptsByModule,
    bestScoresByModule,
  } = useLearningProgress();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<
    Extract<QuizSubmissionResult, { ok: true }> | null
  >(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [showIncompleteMessage, setShowIncompleteMessage] =
    useState(false);

  const submitted = submission !== null;
  const status = hydrated ? getStatus(moduleId) : "locked";

  const correctCount = submission?.correctCount ?? 0;
  const score = submission?.score ?? 0;
  const passed = submission?.passed ?? false;

  const nextModuleIndex =
    curriculum.findIndex((item) => item.id === moduleId) + 1;

  const nextModule = curriculum[nextModuleIndex];

  async function handleSubmit() {
    if (submitting || submitted) return;

    const allAnswered = quiz.questions.every(
      (item) => Boolean(answers[item.id]),
    );

    if (!allAnswered) {
      setShowIncompleteMessage(true);
      return;
    }

    setShowIncompleteMessage(false);
    setSubmitError(null);
    setRequiresAuth(false);
    setSubmitting(true);

    try {
      const result = await recordQuizResult(moduleId, answers);

      if (!result.ok) {
        setSubmitError(result.error);
        setRequiresAuth(Boolean(result.requiresAuth));
        return;
      }

      setSubmission(result);
    } catch {
      setSubmitError(
        "حصلت مشكلة أثناء حفظ نتيجتك. جرّب تاني.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setSubmission(null);
    setSubmitError(null);
    setRequiresAuth(false);
    setShowIncompleteMessage(false);
  }

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

  if (loadError) {
    return (
      <div className="page-container quiz-page">
        <p className="quiz-validation" role="alert">
          {loadError}
        </p>

        <Link href="/roadmap" className="text-link">
          <ArrowLeft size={16} /> رجوع لخريطة المسار
        </Link>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="page-container quiz-page">
        <Link href="/roadmap" className="text-link">
          <ArrowLeft size={16} /> رجوع لخريطة المسار
        </Link>

        <section className="panel quiz-result">
          <XCircle size={34} />

          <h1>المرحلة دي مقفولة</h1>

          <p>
            كمّل اختبارات المراحل المطلوبة الأول قبل ما تبدأ دي.
          </p>

          <Link href="/roadmap" className="button-primary">
            شوف المتطلبات <ArrowLeft size={17} />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-container quiz-page">
      <div className="breadcrumbs">
        <Link href="/">الرئيسية</Link>
        <span>/</span>
        <Link href="/roadmap">خريطة المسار</Link>
        <span>/</span>
        <Link href={`/roadmap/${moduleId}`}>
          {moduleTitle}
        </Link>
        <span>/</span>
        <span>الاختبار</span>
      </div>

      <header className="quiz-header">
        <span className="eyebrow">اختبار المرحلة</span>

        <h1>{quiz.title}</h1>

        <p>
          جاوب على كل الأسئلة ({quiz.questions.length}). محتاج{" "}
          {quiz.passPercentage}% عشان تعدّي وتفتح المرحلة اللي بعدها.
        </p>

        <div className="module-meta">
          <span>{quiz.questions.length} أسئلة</span>
          <span>·</span>
          <span>المطلوب للنجاح {quiz.passPercentage}%</span>
          <span>·</span>
          <span>
            المحاولات: {attemptsByModule[moduleId] ?? 0}
          </span>

          {bestScoresByModule[moduleId] !== undefined && (
            <>
              <span>·</span>
              <span>
                أعلى نتيجة: {bestScoresByModule[moduleId]}%
              </span>
            </>
          )}
        </div>
      </header>

      {!submitted ? (
        <div className="quiz-questions">
          {quiz.questions.map((item, index) => (
            <section
              className="panel quiz-question-card"
              key={item.id}
            >
              <div className="quiz-question-number">
                السؤال {index + 1} من {quiz.questions.length}
              </div>

              <h2>{item.prompt}</h2>

              <div className="quiz-options">
                {item.options.map((option) => {
                  const selected = answers[item.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`quiz-option ${
                        selected ? "is-selected" : ""
                      }`}
                      aria-pressed={selected}
                      disabled={submitting}
                      onClick={() => {
                        setAnswers((previous) => ({
                          ...previous,
                          [item.id]: option.id,
                        }));
                      }}
                    >
                      <span className="quiz-option-letter">
                        {option.id}
                      </span>

                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          {showIncompleteMessage && (
            <p className="quiz-validation" role="alert">
              جاوب على كل الأسئلة قبل التسليم.
            </p>
          )}

          {submitError && (
            <p className="quiz-validation" role="alert">
              {submitError}{" "}
              {requiresAuth && (
                <Link href="/login" className="text-link">
                  سجّل دخولك
                </Link>
              )}
            </p>
          )}

          <div className="quiz-actions">
            <Link
              href={`/roadmap/${moduleId}`}
              className="button-secondary"
            >
              <ArrowLeft size={16} /> رجوع للمرحلة
            </Link>

            <button
              type="button"
              className="button-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "بنحفظ نتيجتك..." : "سلّم إجاباتك"}

              {!submitting && <ArrowLeft size={17} />}
            </button>
          </div>
        </div>
      ) : (
        <section className="panel quiz-result">
          {passed ? (
            <Trophy size={40} />
          ) : (
            <XCircle size={40} />
          )}

          <span
            className={`status-pill ${
              passed ? "completed" : "locked"
            }`}
          >
            {passed ? "عدّيت الاختبار" : "لسه ما عدّيتش"}
          </span>

          <h2>
            {score}% — {correctCount} من {quiz.questions.length} إجابات
            صحيحة
          </h2>

          <p>
            {passed
              ? "مبروك! نتيجتك اتحفظت في حسابك في مسارك، والمرحلة اللي بعدها بقت متاحة."
              : `محتاج ${quiz.passPercentage}% على الأقل عشان تعدّي. راجع الشرح تحت وجرّب تاني.`}
          </p>

          <div className="quiz-review">
            {quiz.questions.map((item, index) => {
              const correct =
                answers[item.id] === item.correctOptionId;

              const correctAnswer = item.options.find(
                (option) => option.id === item.correctOptionId,
              );

              const selectedAnswer = item.options.find(
                (option) => option.id === answers[item.id],
              );

              return (
                <article
                  className="quiz-review-item"
                  key={item.id}
                >
                  <div className="quiz-review-heading">
                    {correct ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}

                    <h3>
                      {index + 1}. {item.prompt}
                    </h3>
                  </div>

                  <p>
                    إجابتك:{" "}
                    {selectedAnswer?.label ?? "مفيش إجابة"}
                  </p>

                  {!correct && (
                    <p>
                      الإجابة الصحيحة: {correctAnswer?.label}
                    </p>
                  )}

                  <p className="stat-note">
                    {item.explanation}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="quiz-actions">
            <Link
              href={`/roadmap/${moduleId}`}
              className="button-secondary"
            >
              رجوع للمرحلة
            </Link>

            {passed && nextModule ? (
              <Link
                href={`/roadmap/${nextModule.id}`}
                className="button-primary"
              >
                كمّل إلى {nextModule.title}{" "}
                <ArrowLeft size={17} />
              </Link>
            ) : passed ? (
              <Link href="/dashboard" className="button-primary">
                افتح لوحة التحكم <ArrowLeft size={17} />
              </Link>
            ) : (
              <button
                type="button"
                className="button-primary"
                onClick={handleRetry}
              >
                <RotateCcw size={17} /> جرّب تاني
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
