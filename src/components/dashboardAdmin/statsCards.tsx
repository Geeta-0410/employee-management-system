import type { Employee } from "../../types/employee";

interface Props {
  employees: Employee[];
}

export default function StatsCards({ employees }: Props) {
  const totalEmployees = employees.length;

  const totalCompanies = new Set(
    employees.map((e) => e.company)
  ).size;

  const totalDepartments = new Set(
    employees.map((e) => e.department)
  ).size;

  const avgExperience =
    employees.length > 0
      ? (
          employees.reduce(
            (sum, emp) =>
              sum + Number(emp.experience),
            0
          ) / employees.length
        ).toFixed(1)
      : "0";

  const cards = [
    {
      title: "Employees",
      value: totalEmployees,
    },
    {
      title: "Companies",
      value: totalCompanies,
    },
    {
      title: "Departments",
      value: totalDepartments,
    },
    {
      title: "Avg Experience",
      value: `${avgExperience} yrs`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-3xl p-6 shadow-sm border"
        >
          <p className="text-slate-500">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}