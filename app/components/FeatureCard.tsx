import { type ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bullets: string[];
}

export default function FeatureCard({
  icon,
  title,
  description,
  bullets,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col rounded-[13px] border border-[#BDBDBD] p-8 transition-shadow hover:shadow-md">
      <div className="mb-4 h-[42px] w-[42px] text-gray-800">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-lg font-medium text-[#3D4151]">{description}</p>
      <ul className="mt-6 list-disc space-y-1 pl-5 text-sm font-medium text-[#454546]">
        {bullets.map((item) => (
          <li key={item} className="leading-[25px]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
