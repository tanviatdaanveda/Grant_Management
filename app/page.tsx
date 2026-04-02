import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureCard from "./components/FeatureCard";
import {
  BuildingOfficeIcon,
  FoundationIcon,
  AIIcon,
  TransparencyIcon,
} from "./components/icons";

const features = [
  {
    icon: <BuildingOfficeIcon />,
    title: "For Corporates",
    description: "Create and manage grant opportunities with ease.",
    bullets: [
      "Customizable evaluation criteria.",
      "Public or private grants.",
      "Real-time application tracking.",
    ],
  },
  {
    icon: <FoundationIcon />,
    title: "For Foundations",
    description: "Create and manage grant opportunities with ease.",
    bullets: [
      "Customizable evaluation criteria.",
      "Public or private grants.",
      "Real-time application tracking.",
    ],
  },
  {
    icon: <AIIcon />,
    title: "AI Evaluation",
    description: "Intelligent AI-powered screening.",
    bullets: [
      "Automated screening.",
      "Qualitative insights.",
      "Configurable weights.",
    ],
  },
  {
    icon: <TransparencyIcon />,
    title: "Transparency",
    description: "Complete visibility and compliance.",
    bullets: [
      "Document verification.",
      "Activity tracking.",
      "Audit trails.",
    ],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <HeroSection />

      {/* Feature Cards */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}
