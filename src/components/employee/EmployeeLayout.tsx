import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";

import { getEmployeeProfile } from "../../services/employeeService";

function EmployeeLayout() {
  const [employee, setEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-300">
      <EmployeeNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        employee={employee}
      />

      <div className="flex pt-16">
        <EmployeeSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default EmployeeLayout;