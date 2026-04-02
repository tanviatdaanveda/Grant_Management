import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center px-6 pt-20 pb-16 lg:pt-28 lg:pb-20">
      <h1 className="max-w-3xl text-center text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-[48px] lg:leading-[1.2]">
        <span className="italic text-[#375DFB]">AI-Powered </span>
        Grant Screening for{" "}
        <span className="italic text-[#375DFB]">Social Impact</span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-lg text-[#3D4151] sm:text-xl lg:text-2xl">
        Connect corporates with verified NGOs through intelligent grant
        management &amp; automated evaluation
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/grants"
          className="inline-flex items-center gap-2 rounded-[13px] bg-[#375DFB] px-8 py-3.5 text-lg font-medium text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#2a4de6]"
        >
          Browse Grants
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12H20M20 12L14 6M20 12L14 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <Link
          href="/get-started"
          className="inline-flex items-center rounded-md border border-[#CACACA] px-8 py-3.5 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
