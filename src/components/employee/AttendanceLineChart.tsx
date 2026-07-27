import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getMonthlyAttendance } from "../../services/attendanceService";

interface AttendanceData {
  month: string;
  attendance: number;
}

interface AttendanceLineChartProps {
  refresh: boolean;
}

function AttendanceLineChart({
  refresh,
}: AttendanceLineChartProps) {
  const [attendanceData, setAttendanceData] = useState<
    AttendanceData[]
  >([]);

  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const response = await getMonthlyAttendance();

      setAttendanceData(response.data.data);
    } catch (error) {
      console.error("Failed to load attendance", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [refresh]);

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-3xl shadow p-6">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-3xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        Attendance Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={attendanceData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default AttendanceLineChart;