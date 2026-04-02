interface GrantCardProps {
  title: string;
  status: "Active" | "Draft" | "Closed";
  visibility: "DaanVeda only" | "Public";
  postDate: string;
  deadline: string;
  applicationCount: number;
  isSelected?: boolean;
}

export default function GrantCard({
  title,
  status,
  visibility,
  postDate,
  deadline,
  applicationCount,
  isSelected = false,
}: GrantCardProps) {
  return (
    <div
      className={`relative flex overflow-hidden rounded-md border transition-shadow hover:shadow-sm ${
        isSelected ? "border-transparent" : "border-gray-200"
      }`}
    >
      {/* Active indicator bar */}
      {isSelected && (
        <div className="w-1.5 flex-none rounded-l-lg bg-[#11A1FB]" />
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h4 className="text-sm font-semibold text-black leading-snug">{title}</h4>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
              status === "Active"
                ? "bg-[#C9FFDB] text-[#077537]"
                : status === "Draft"
                ? "bg-gray-100 text-gray-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {status}
          </span>
          {visibility === "DaanVeda only" && (
            <span className="flex items-center gap-1 rounded-full bg-[#FFF5AD] px-2.5 py-0.5 text-[9px] font-medium text-[#935C24]">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              DaanVeda only
            </span>
          )}
        </div>

        {/* Bottom row: avatars + dates + count */}
        <div className="flex items-end justify-between">
          {/* Reviewer avatars */}
          <div className="flex -space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-6 rounded border border-white bg-gray-200"
              />
            ))}
          </div>

          <div className="flex items-center gap-6">
            {/* Dates */}
            <div className="text-[9px] text-gray-500">
              <p>
                <span className="font-medium text-black">Post Date:</span>{" "}
                {postDate}
              </p>
              <p>
                <span className="font-medium text-black">Deadline:</span>{" "}
                {deadline}
              </p>
            </div>

            {/* Application count */}
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
              {applicationCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
