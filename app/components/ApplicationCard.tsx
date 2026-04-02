interface ApplicationCardProps {
  title: string;
  submittedDate: string;
  status: string;
  aiScore: number;
  applicantName: string;
}

export default function ApplicationCard({
  title,
  submittedDate,
  status,
  aiScore,
  applicantName,
}: ApplicationCardProps) {
  return (
    <div className="rounded-md border border-gray-200 p-4 transition-shadow hover:shadow-sm">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-black leading-snug max-w-[65%]">
          {title}
        </h4>
        <p className="text-[9px] text-gray-500 whitespace-nowrap">
          <span className="font-medium text-black">Submitted:</span> {submittedDate}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#C9FFDB] px-2.5 py-0.5 text-[9px] font-semibold text-[#077537]">
          {status}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-[#C9FFDB] px-2.5 py-0.5 text-[9px] font-medium text-[#077537]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 18l4-4 3 3 5-7 4 4V18H4z" />
            <path d="M4 18V6" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          AI Score: {aiScore}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-[#D0FDFA] px-2.5 py-0.5 text-[9px] font-medium text-[#07476E]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </span>
      </div>

      {/* Bottom row */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-200" />
          <span className="text-[10px] text-black">By {applicantName}</span>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#242424] px-4 py-1 text-[9px] font-medium text-white hover:bg-black transition-colors"
        >
          View Application
        </button>
      </div>
    </div>
  );
}
