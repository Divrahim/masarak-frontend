
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  Compass,
} from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="page-container onboarding-page">
      <header className="onboarding-heading">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          خصّص رحلتك
        </span>

        <h1>عايز تبدأ منين؟</h1>

        <p>
          كل واحد بيبدأ من مكان مختلف. اختار الخيار اللي يناسبك،
          ومسارك هيساعدك تحدد تركيزك الجاي.
        </p>
      </header>

      <div className="onboarding-options">
        <section className="panel onboarding-option">
          <div className="onboarding-option-icon">
            <BookOpen size={25} />
          </div>

          <span className="onboarding-option-label">
            الخيار 01
          </span>

          <h2>ابدأ من الصفر</h2>

          <p>
            ابدأ بالأساسيات وامشي خطوة بخطوة. اختار الخيار ده لو
            تحب تتعلم كل حاجة من البداية.
          </p>

          <div className="onboarding-option-action">
            <Link
              href="/dashboard"
              className="button-primary onboarding-button"
            >
              ابدأ التعلم
              <ArrowLeft size={18} />
            </Link>
          </div>
        </section>

        <section className="panel onboarding-option">
          <div className="onboarding-option-icon">
            <ClipboardCheck size={25} />
          </div>

          <span className="onboarding-option-label">
            الخيار 02
          </span>

          <h2>قيّم مهاراتك الحالية</h2>

          <p>
            جاوب على مجموعة أسئلة أولية عشان نقدّر اللي تعرفه
            ونحدد نقطة بداية مقترحة ليك. وتقدر ترفق الـCV لو حابب.
          </p>

          <Link
            href="/onboarding/assessment"
            className="button-primary onboarding-button"
          >
            ابدأ التقييم
            <ArrowLeft size={18} />
          </Link>
        </section>
      </div>

      <p className="onboarding-footnote">
        <Compass size={16} />
        التقييم والمراحل الحالية مبدئيين وهيتخصصوا لمسارك.
      </p>
    </div>
  );
}
