import StatsCards from "../components/dashboardAdmin/statsCards";
import DepartmentPieChart from "../components/dashboardAdmin/DepartmentPieChart";
import CompanyBarChart from "../components/dashboardAdmin/CompanyBarChart";
import SkillBarChart from "../components/dashboardAdmin/SkillBarChart";
import RecentActivity from "../components/dashboardAdmin/RecentActivity";
import type { Employee } from "../types/employee";

interface Props {
  employees: Employee[];
}

export default function DashboardPage({
  employees,
}: Props) {
  return (
    <div className="space-y-6">

      <StatsCards employees={employees} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DepartmentPieChart employees={employees} />

        <CompanyBarChart employees={employees} />

        <SkillBarChart employees={employees} />
      </div>

      {/* Full Width */}
      <div className="w-full">
        <RecentActivity employees={employees} />
      </div>

    </div>
  );
}