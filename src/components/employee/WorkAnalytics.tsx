import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
}

export default function WorkAnalytics({ data }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
      {/* Avg Work Hours */}

      <div className="xl:col-span-2 bg-white rounded-3xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">Avg Work Hours</h2>

        <p className="text-slate-500 text-sm mb-4">
          Track average hours worked monthly
        </p>

        <div className="h-70">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="avgHours"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Hours */}

      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Work Hours Per Month</h2>

        <div className="h-70">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="totalHours" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
