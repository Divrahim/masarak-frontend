
"use client";

import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { useLearningProgress } from "@/components/learning-progress-provider";

type ModuleContentGateProps = {
  moduleId: string;
  children: ReactNode;
  showLockedMessage?: boolean;
};

export default function ModuleContentGate({
  moduleId,
  children,
  showLockedMessage = true,
}: ModuleContentGateProps) {
  const { getStatus } = useLearningProgress();
  const isLocked = getStatus(moduleId) === "locked";

  if (!isLocked) {
    return <>{children}</>;
  }

  if (!showLockedMessage) {
    return null;
  }

  return (
    <section className="panel detail-section">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <LockKeyhole size={24} />
        <div>
          <h2>محتوى التعلم مقفول</h2>
          <p>
            اجتز اختبارات متطلبات المرحلة دي عشان تفتح مصادر التعلم، ومعايير
            الإتمام، والمهمة العملية، واختبار المرحلة.
          </p>
          <p className="stat-note">
            والمرحلة مقفولة، تقدر تستعرض أهداف التعلم والمتطلبات السابقة.
          </p>
        </div>
      </div>
    </section>
  );
}
