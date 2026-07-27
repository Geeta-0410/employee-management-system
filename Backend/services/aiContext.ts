import Attendance from "../models/Attendance";
import Task from "../models/Task";
import Employee from "../models/employee";
export const buildEmployeeContext = async (employeeId: string) => {
  const employee = await Employee.findById(employeeId).select(
    "name department skills experience",
  );

  const attendanceThisMonth = await Attendance.find({
    employeeId,
    date: { $gte: new Date(new Date().setDate(1)) },
  });

  const presentDays = attendanceThisMonth.filter(
    (a: any) => a.status === "present",
  ).length;

  const pendingTasks = await Task.find({
    assignedTo: employeeId,
    status: { $ne: "completed" },
  }).select("title dueDate priority");

  return {
    name: employee?.name,
    department: employee?.department,
    skills: employee?.skills,
    attendanceSummary: {
      presentDays,
      totalDaysTracked: attendanceThisMonth.length,
    },
    pendingTasks: pendingTasks.map((t: any) => ({
      title: t.title,
      dueDate: t.dueDate,
      priority: t.priority,
    })),
  };
};
