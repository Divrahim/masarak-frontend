import type { Metadata } from "next";
import RoadmapClient from "@/components/roadmap-client";

export const metadata: Metadata = {
  title: "خريطة المسار",
  description:
    "اكتشف رحلتك في تعلم هندسة الويب، وتابع تقدمك من الأساسيات حتى بناء مشاريع متكاملة.",
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}