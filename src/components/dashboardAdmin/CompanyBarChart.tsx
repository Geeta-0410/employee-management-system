import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Employee } from "../../types/employee";

interface Props {
  employees: Employee[];
}

export default function CompanyBarChart({
  employees,
}: Props) {
  const companyMap: Record<string, number> = {};

  employees.forEach((emp) => {
    companyMap[emp.company] =
      (companyMap[emp.company] || 0) + 1;
  });

  const data = Object.entries(companyMap).map(
    ([company, count]) => ({
      company,
      count,
    })
  );

  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Company Ranking
        
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="company" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="count"
              fill="#6366F1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}