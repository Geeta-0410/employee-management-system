interface Props {
  domain: string[];
  companyCount: Record<string, number>;
}

export default function EmployeeInsights({
  domain,
  companyCount,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
      {/* Most Common Domain */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Most Common Domain
        </h2>

        <div className="flex flex-wrap gap-2">
          {domain.length > 0 ? (
            domain.map((d) => (
              <span
                key={d}
                className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm"
              >
                {d}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-sm">
              N/A
            </span>
          )}
        </div>
      </div>

      {/* Users Per Company */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Users Per Company
        </h2>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {Object.keys(companyCount).length > 0 ? (
            Object.keys(companyCount)
              .sort()
              .map((company) => (
                <div
                  key={company}
                  className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3"
                >
                  <span className="font-medium text-slate-700">
                    {company}
                  </span>

                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {companyCount[company]}
                  </span>
                </div>
              ))
          ) : (
            <span className="text-gray-400">
              No data
            </span>
          )}
        </div>
      </div>
    </div>
  );
}