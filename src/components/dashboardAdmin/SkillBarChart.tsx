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

export default function SkillBarChart({
  employees,
}: Props) {
  const skillMap: Record<string, number> = {};

  employees.forEach((emp) => {
    emp.skills?.forEach((skill) => {
      skillMap[skill.name] =
        (skillMap[skill.name] || 0) + 1;
    });
  });

  const data = Object.entries(skillMap)
    .map(([skill, count]) => ({
      skill,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm h-[420px]">
      <h2 className="text-lg font-semibold mb-4">
        Skills Distribution
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          }}
        >
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="skill"
            width={120}
          />
          <Tooltip />

          <Bar
            dataKey="count"
            fill="#4F46E5"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}