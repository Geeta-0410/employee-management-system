import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Skill {
  _id?: string;
  name: string;
  level: number;
}

interface Props {
  skills: Skill[];
}

function SkillsBarChart({ skills }: Props) {
  return (
    <div className="bg-slate-200 rounded-3xl shadow-lg p-6 h-[420px] m-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Skills Distribution
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={skills}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          barCategoryGap="55%"
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" tick={{ fontSize: 12 }} />

          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />

          <Tooltip />

          <Bar
            dataKey="level"
            fill="#4F46E5"
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SkillsBarChart;
