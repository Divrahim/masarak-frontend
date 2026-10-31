
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

import {
  placementQuestions,
  placementModuleIds,
  placementFallbackModuleId,
  evaluatePlacementAnswers,
} from "@/lib/placement-assessment";

import { curriculum } from "@/lib/curriculum";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

type AssessmentResult = {
  overallScore: number;
  validatedModuleIds: string[];
  recommendedStartModuleId: string;
  recommendedStartModuleTitle: string;
};

export default function PlacementAssessmentClient() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || result) return;

    if (
      !placementQuestions.every(
        (question) => answers[question.id],
      )
    ) {
      setError("جاوب على كل الأسئلة قبل التسليم.");
      return;
    }

    if (cvFile) {
      if (cvFile.size > MAX_FILE_SIZE) {
        setError("حجم الـCV لازم يكون ٥ ميجا أو أقل.");
        return;
      }

      const extension = cvFile.name.split(".").pop()?.toLowerCase();

      if (!extension || !MIME_TYPES[extension]) {
        setError("ارفع الـCV بصيغة PDF أو DOC أو DOCX.");
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      // Evaluate answers locally without any backend request.
      const evaluation = evaluatePlacementAnswers(answers);

      // Preserve the original continuous-validation rule.
      const validatedModuleIds: string[] = [];

      for (const moduleId of placementModuleIds) {
        const moduleResult = evaluation.modules.find(
          (item) => item.moduleId === moduleId,
        );

        if (!moduleResult?.mastered) {
          break;
        }

        validatedModuleIds.push(moduleId);
      }

      const recommendedStartModuleId =
        placementModuleIds[validatedModuleIds.length] ??
        placementFallbackModuleId;

      const recommendedModule = curriculum.find(
        (item) => item.id === recommendedStartModuleId,
      );

      if (!recommendedModule) {
        setError(
          "المرحلة المقترحة مش مضبوطة في الخريطة الحالية.",
        );
        return;
      }

      setResult({
        overallScore: evaluation.overallScore,
        validatedModuleIds,
        recommendedStartModuleId,
        recommendedStartModuleTitle: recommendedModule.title,
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "معرفنش نقيّم إجاباتك. جرّب تاني.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="panel p-6">
        <CheckCircle2 size={36} />

        <h2 className="mt-4 text-2xl font-semibold">
          التقييم اكتمل
        </h2>

        <p className="mt-3">
          نتيجتك الكلية <strong>{result.overallScore}%</strong>.
        </p>

        <p className="mt-2">
          المراحل اللي أتقنتها من التقييم ده:{" "}
          <strong>{result.validatedModuleIds.length}</strong>.
        </p>

        <p className="mt-4">
          نقطة البداية المقترحة ليك:{" "}
          <strong>{result.recommendedStartModuleTitle}</strong>.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          دي نتيجة مبدئية بناءً على إجاباتك. التقييم بيتعمل محليًا
          دلوقتي ومحفوظش في أي حساب.
        </p>

        {cvFile && (
          <p className="mt-2 text-sm text-gray-500">
            الـCV ({cvFile.name}) اتحط للجلسة دي بس، ومتخزنش في أي مكان.
          </p>
        )}

        <div className="dashboard-actions mt-6">
          <button
            type="button"
            className="button-primary"
            onClick={() => {
              router.push(
                `/roadmap/${result.recommendedStartModuleId}`,
              );
            }}
          >
            افتح المرحلة المقترحة
            <ArrowLeft size={17} />
          </button>

          <Link
            href="/dashboard"
            className="button-secondary"
          >
            افتح لوحة التحكم
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="quiz-questions">
      <section className="panel p-6">
        <label
          htmlFor="placement-cv"
          className="block text-lg font-semibold"
        >
          ارفق الـCV (اختياري)
        </label>

        <p className="mt-2 text-sm text-gray-500">
          PDF أو DOC أو DOCX. الحد الأقصى ٥ ميجا. الملف بيتاختار
          محليًا ومش هيتقّع على السيرفر.
        </p>

        <div className="cv-upload-control">
          <input
            id="placement-cv"
            className="cv-file-input"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={submitting}
            onChange={(event) => {
              setCvFile(event.target.files?.[0] ?? null);
              setError(null);
            }}
          />

          <label
            htmlFor="placement-cv"
            className="cv-upload-button"
          >
            <UploadCloud size={20} />
            <span>
              {cvFile ? "غيّر ملف الـCV" : "اختار الـCV بتاعك"}
            </span>
          </label>

          <span className="cv-upload-hint">
            PDF أو DOC أو DOCX · حتى ٥ ميجا
          </span>
        </div>

        {cvFile && (
          <p className="mt-3 text-sm">
            <UploadCloud size={16} className="mr-2 inline" />
            {cvFile.name}
          </p>
        )}
      </section>

      {placementQuestions.map((question, index) => (
        <section
          key={question.id}
          className="panel quiz-question-card"
        >
          <div className="quiz-question-number">
            السؤال {index + 1} من {placementQuestions.length}
          </div>

          <h2>{question.prompt}</h2>

          <div className="quiz-options">
            {question.options.map((option) => {
              const selected =
                answers[question.id] === option.id;

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
                      [question.id]: option.id,
                    }));

                    setError(null);
                  }}
                >
                  <span className="quiz-option-letter">
                    {option.id.toUpperCase()}
                  </span>

                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {error && (
        <p role="alert" className="quiz-validation">
          {error}
        </p>
      )}

      <div className="quiz-actions">
        <span className="stat-note">
          جاوبت على {Object.keys(answers).length} من{" "}
          {placementQuestions.length}
        </span>

        <button
          type="submit"
          className="button-primary"
          disabled={submitting}
        >
          {submitting ? "بنقيّم إجاباتك..." : "سلّم التقييم"}

          {!submitting && <ArrowLeft size={17} />}
        </button>
      </div>
    </form>
  );
}
