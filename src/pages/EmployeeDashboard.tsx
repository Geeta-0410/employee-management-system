import { useEffect, useState } from "react";
import EmployeeNavbar from "../components/employee/EmployeeNavbar";
import EmployeeSidebar from "../components/employee/EmployeeSidebar";
import WelcomeCard from "../components/employee/WelcomeCard";
import EmployeeStats from "../components/employee/EmployeeStats";
import WorkAnalytics from "../components/employee/WorkAnalytics";

import { getWorkHoursReport } from "../services/attendanceService";

import { getEmployeeProfile } from "../services/employeeService";

function EmployeeDashboard() {
  const [employee, setEmployee] = useState<any>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getEmployeeProfile();

        setEmployee(res.data.employee);
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getWorkHoursReport();

      setAnalyticsData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadAnalytics();
  return (
    <div className="bg-slate-300">
      {/* Navbar */}

      <EmployeeNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        employee={employee}
      />

      <div className="flex pt-16">
        {/* Sidebar */}

        <EmployeeSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        {/* Main Content */}

        <main
          className={`
  flex-1
  p-6
  transition-all
  duration-300
`}
        >
          <WelcomeCard employee={employee} onAttendanceMarked={() => {}} />

          {/* Stat Cards */}
          <div className="my-8">
            {" "}
            <EmployeeStats employee={employee} />
          </div>

          <WorkAnalytics data={analyticsData} />
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
