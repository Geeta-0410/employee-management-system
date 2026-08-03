import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Employee } from "../../types/employee";

interface Props {
  employees: Employee[];
}

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

export default function DepartmentPieChart({
  employees,
}: Props) {
  const departmentMap: Record<string, number> = {};

  employees.forEach((emp) => {
    departmentMap[emp.department] =
      (departmentMap[emp.department] || 0) + 1;
  });

  const data = Object.entries(departmentMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Department Distribution
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              outerRadius={100}
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}