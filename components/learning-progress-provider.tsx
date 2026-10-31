
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { curriculum } from "@/lib/curriculum";

import {
  emptyLearningProgress,
  getProgressStatus,
  type LearningProgress,
  type QuizSubmissionResult,
} from "@/lib/learning-progress";

import {
  getLearningProgressAction,
  submitModuleQuizAction,
} from "@/app/learning-progress/actions";

type LearningProgressContextValue = LearningProgress & {
  hydrated: boolean;
  loadError: string | null;
  getStatus: (moduleId: string) => "completed" | "current" | "locked";
  recordQuizResult: (
    moduleId: string,
    answers: Record<string, string>
  ) => Promise<QuizSubmissionResult>;
};

const LearningProgressContext =
  createContext<LearningProgressContextValue | null>(null);

export function LearningProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [progress, setProgress] = useState<LearningProgress>(
    emptyLearningProgress
  );

  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const refreshProgress = async () => {
      try {
        const result = await getLearningProgressAction();

        if (!active) return;

        if (!result.ok) {
          setProgress(emptyLearningProgress);
          setLoadError(result.error);
        } else {
          setProgress(result.progress);
          setLoadError(null);
        }
      } catch (error) {
        console.error("Failed to load progress:", error);

        if (!active) return;

        setProgress(emptyLearningProgress);
        setLoadError("Couldn't load saved progress. Please refresh the page.");
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    };

    void refreshProgress();

    return () => {
      active = false;
    };
  }, []);

  const recordQuizResult = useCallback(
    async (
      moduleId: string,
      answers: Record<string, string>
    ): Promise<QuizSubmissionResult> => {
      const result = await submitModuleQuizAction(moduleId, answers);

      if (result.ok) {
        setProgress(result.progress);
        setLoadError(null);
      }

      return result;
    },
    []
  );

  const value = useMemo<LearningProgressContextValue>(
    () => ({
      ...progress,
      hydrated,
      loadError,
      getStatus: (moduleId) =>
        curriculum.some((item) => item.id === moduleId)
          ? getProgressStatus(moduleId, progress.completedModuleIds)
          : "locked",
      recordQuizResult,
    }),
    [progress, hydrated, loadError, recordQuizResult]
  );

  return (
    <LearningProgressContext.Provider value={value}>
      {children}
    </LearningProgressContext.Provider>
  );
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);

  if (!context) {
    throw new Error(
      "useLearningProgress must be used inside LearningProgressProvider."
    );
  }

  return context;
}
