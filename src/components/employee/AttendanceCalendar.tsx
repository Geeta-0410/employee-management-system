import { useEffect, useState } from "react";
import { getCalendarAttendance } from "../../services/attendanceService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface AttendanceCalendarProps {
  refresh: boolean;
}

interface Attendance {
  date: string;
  status: string;
}

export default function AttendanceCalendar({
  refresh,
}: AttendanceCalendarProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    loadAttendance();
  }, [refresh, currentMonth, currentYear]);

  const loadAttendance = async () => {
    try {
      const res = await getCalendarAttendance(currentMonth, currentYear);

      setAttendance(res.data.data);
      setAttendance(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Attendance sirf current month ki
  const attendanceDays = attendance.map((item) =>
    new Date(item.date).getDate(),
  );

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 ">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Attendance Calendar</h2>

        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="w-9 h-9 rounded-full border hover:bg-slate-100 flex items-center justify-center"
          >
            <FaChevronLeft />
          </button>

          <span className="text-lg font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </span>

          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-full border hover:bg-slate-100 flex items-center justify-center"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Week */}

      <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-4">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={index}></div>
        ))}

        {Array.from({ length: totalDays }).map((_, index) => {
          const day = index + 1;

          const present = attendanceDays.includes(day);

          return (
            <div
              key={day}
              className={`
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                font-medium
                border
                mx-auto
                ${
                  present
                    ? "bg-green-400 text-white border-green-400"
                    : "bg-red-100 text-red-500 border-red-200"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}

      <div className="flex gap-8 mt-8 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>

          <span>Present</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-400"></div>

          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
