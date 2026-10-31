
import { curriculum } from "@/lib/curriculum";
import { quizzes } from "@/lib/quizzes";
import {
  emptyLearningProgress,
  type LearningProgress,
  type LearningProgressLoadResult,
  type QuizSubmissionResult,
} from "@/lib/learning-progress";

const STORAGE_KEY = "masarak-learning-progress";

type StoredData = {
  progress: LearningProgress;
  attempts: {
    moduleId: string;
    score: number;
    createdAt: string;
  }[];
};

function getStoredData(): StoredData {
  if (typeof window === "undefined") {
    return {
      progress: { ...emptyLearningProgress },
      attempts: [],
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) return JSON.parse(stored) as StoredData;
  } catch (error) {
    console.error("Failed to read learning progress:", error);
  }

  return {
    progress: { ...emptyLearningProgress },
    attempts: [],
  };
}

function saveStoredData(data: StoredData) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calculateProgress(attempts: StoredData["attempts"], completedIds: string[]) {
  const attemptsByModule: Record<string, number> = {};
  const bestScoresByModule: Record<string, number> = {};
  const latestScoresByModule: Record<string, number> = {};

  for (const attempt of attempts) {
    const id = attempt.moduleId;

    attemptsByModule[id] = (attemptsByModule[id] ?? 0) + 1;

    bestScoresByModule[id] = Math.max(
      bestScoresByModule[id] ?? 0,
      attempt.score
    );

    latestScoresByModule[id] = attempt.score;
  }

  return {
    version: 1 as const,
    completedModuleIds: completedIds,
    attemptsByModule,
    bestScoresByModule,
    latestScoresByModule,
  };
}

export async function getLearningProgressAction(): Promise<LearningProgressLoadResult> {
  try {
    const data = getStoredData();

    return {
      ok: true,
      authenticated: true,
      progress: calculateProgress(
        data.attempts,
        data.progress.completedModuleIds
      ),
    };
  } catch (error) {
    console.error("Failed to load learning progress:", error);

    return {
      ok: false,
      error: "Couldn't load your learning progress.",
    };
  }
}

export async function submitModuleQuizAction(
  moduleId: string,
  answers: Record<string, string>
): Promise<QuizSubmissionResult> {
  const roadmapModule = curriculum.find(
    (item) => item.id === moduleId
  );

  const quiz = quizzes.find(
    (item) => item.moduleId === moduleId
  );

  if (!roadmapModule || !quiz) {
    return {
      ok: false,
      error: "This quiz doesn't exist.",
    };
  }

  if (
    typeof answers !== "object" ||
    answers === null ||
    Array.isArray(answers)
  ) {
    return {
      ok: false,
      error: "Invalid quiz answers.",
    };
  }

  const validAnswers = quiz.questions.every((question) => {
    const answer = answers[question.id];

    return (
      typeof answer === "string" &&
      question.options.some((option) => option.id === answer)
    );
  });

  if (
    Object.keys(answers).length !== quiz.questions.length ||
    !validAnswers
  ) {
    return {
      ok: false,
      error: "Please answer every question before submitting.",
    };
  }

  try {
    const data = getStoredData();

    const completedIds = data.progress.completedModuleIds;

    const prerequisitesCompleted = roadmapModule.prerequisites.every(
      (id) => completedIds.includes(id)
    );

    if (!prerequisitesCompleted) {
      return {
        ok: false,
        error: "Complete the prerequisite modules before taking this quiz.",
      };
    }

    const correctCount = quiz.questions.filter(
      (question) =>
        answers[question.id] === question.correctOptionId
    ).length;

    const score = Math.round(
      (correctCount / quiz.questions.length) * 100
    );

    const passed = score >= quiz.passPercentage;

    data.attempts.push({
      moduleId,
      score,
      createdAt: new Date().toISOString(),
    });

    if (passed && !completedIds.includes(moduleId)) {
      completedIds.push(moduleId);
    }

    data.progress = calculateProgress(
      data.attempts,
      completedIds
    );

    saveStoredData(data);

    return {
      ok: true,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      passed,
      progress: data.progress,
    };
  } catch (error) {
    console.error("Failed to save quiz result:", error);

    return {
      ok: false,
      error: "We couldn't save your quiz result. Please try again.",
    };
  }
}
