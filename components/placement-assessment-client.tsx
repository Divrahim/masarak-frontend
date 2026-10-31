
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
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
      setError("Please answer every question before submitting.");
      return;
    }

    if (cvFile) {
      if (cvFile.size > MAX_FILE_SIZE) {
        setError("Your CV must be 5 MB or smaller.");
        return;
      }

      const extension = cvFile.name.split(".").pop()?.toLowerCase();

      if (!extension || !MIME_TYPES[extension]) {
        setError("Upload your CV as a PDF, DOC, or DOCX file.");
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
          "The recommended module isn't configured in the current roadmap.",
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
          : "We couldn't evaluate your answers. Please try again.",
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
          Assessment completed
        </h2>

        <p className="mt-3">
          Your overall score is{" "}
          <strong>{result.overallScore}%</strong>.
        </p>

        <p className="mt-2">
          Modules mastered through this assessment:{" "}
          <strong>{result.validatedModuleIds.length}</strong>.
        </p>

        <p className="mt-4">
          Your suggested starting point is{" "}
          <strong>{result.recommendedStartModuleTitle}</strong>.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          This is a provisional placement result based on your
          answers. Your assessment is currently processed locally
          and has not been saved to an account.
        </p>

        {cvFile && (
          <p className="mt-2 text-sm text-gray-500">
            Your CV ({cvFile.name}) was selected for this session,
            but it was not uploaded or stored.
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
            Open recommended module
            <ArrowRight size={17} />
          </button>

          <Link
            href="/dashboard"
            className="button-secondary"
          >
            Go to dashboard
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
          Attach your CV (optional)
        </label>

        <p className="mt-2 text-sm text-gray-500">
          PDF, DOC, or DOCX. Maximum size: 5 MB.
          The file is selected locally and will not be uploaded.
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
              {cvFile ? "Change CV file" : "Choose your CV"}
            </span>
          </label>

          <span className="cv-upload-hint">
            PDF, DOC, or DOCX · Up to 5 MB
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
            Question {index + 1} of {placementQuestions.length}
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
          {Object.keys(answers).length} of{" "}
          {placementQuestions.length} answered
        </span>

        <button
          type="submit"
          className="button-primary"
          disabled={submitting}
        >
          {submitting ? "Evaluating..." : "Submit assessment"}

          {!submitting && <ArrowRight size={17} />}
        </button>
      </div>
    </form>
  );
}
