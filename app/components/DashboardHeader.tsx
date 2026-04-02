interface ProgramInfo {
  title: string;
  tags: { label: string; color: "green" | "yellow" | "red" }[];
  applicationCount: number;
  shortlistedCount: number;
}

const tagStyles = {
  green: "bg-[#C9FFDB] text-[#077537]",
  yellow: "bg-[#FFF5AD] text-[#935C24]",
  red: "bg-[#FFC0C0] text-[#A30505]",
};

export default function DashboardHeader({ program }: { program: ProgramInfo }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700">
      {/* Background image overlay */}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative px-8 pt-6 pb-48">
        <div className="flex items-center gap-2 text-white">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </div>

      {/* Program Info Card */}
      <div className="absolute bottom-6 left-8 right-8 max-w-lg rounded-lg bg-white/95 p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-black">{program.title}</h2>
          <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Edit program">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {program.tags.map((tag) => (
            <span
              key={tag.label}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium ${tagStyles[tag.color]}`}
            >
              {tag.color === "yellow" && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
              {tag.label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-10">
          <div>
            <p className="text-xl font-semibold text-black">
              {program.applicationCount.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-gray-500">Count of Applications</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-black">{program.shortlistedCount}</p>
            <p className="text-xs font-medium text-gray-500">Shortlisted by AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
