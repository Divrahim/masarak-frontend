
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  // بيانات تجريبية للواجهة فقط
  const displayName = "Student";
  const email = "student@example.com";
  const startPathLabel = "Not selected yet";
  const hasSelectedPath = false;

  return (
    <div className="page-container">
      <div className="page-heading">
        <span className="eyebrow">Your account</span>

        <h1>My Profile</h1>

        <p>
          Review your account information and manage
          your learning journey.
        </p>
      </div>

      <section className="panel p-6">
        <h2 className="text-xl font-semibold">
          Account information
        </h2>

        <div className="mt-6 grid gap-5">
          <div>
            <p className="text-sm text-gray-500">
              Full name
            </p>
            <p className="font-medium">{displayName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>
            <p className="font-medium">{email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Starting path
            </p>
            <p className="font-medium">{startPathLabel}</p>
          </div>
        </div>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="text-xl font-semibold">
          Learning journey
        </h2>

        <p className="mt-2 text-gray-500">
          Your learning path is still customizable.
          You can review your roadmap or reassess your
          current skills.
        </p>

        <div className="dashboard-actions mt-5">
          <Link
            href="/dashboard"
            className="button-primary"
          >
            Open dashboard
          </Link>

          <Link
            href="/onboarding/assessment"
            className="button-secondary"
          >
            Assess my skills
          </Link>

          {!hasSelectedPath && (
            <Link
              href="/onboarding"
              className="button-secondary"
            >
              Choose starting path
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
