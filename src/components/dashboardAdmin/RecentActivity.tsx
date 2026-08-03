import type { Employee } from "../../types/employee";

interface Props {
  employees: Employee[];
}

export default function RecentActivity({
  employees,
}: Props) {
  return (
    <div className="w-full bg-white rounded-3xl p-6 border shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Recent Employees
      </h2>

      <div className="space-y-4">
        {employees.slice(0, 5).map((emp) => (
          <div
            key={emp.employeeId}
            className="flex justify-between items-center border-b border-slate-200 pb-3"
          >
            <div>
              <p className="font-medium text-slate-800">
                {emp.name}
              </p>

              <p className="text-sm text-slate-500">
                {emp.email}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">
              {emp.department}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
