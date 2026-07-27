import { Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Header from "../components/Header";
import EmployeeForm from "../components/employeeForm";
import UserDashboard from "../components/userDashboard";
import { logoutUser } from "../services/authServices";
import useEmployees from "../hooks/useEmployee";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }
  const handleLogout = async () => {
    try {
      const res = await logoutUser();

      toast.success(res.data.message || "Logged out successfully");

      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err: any) {
      console.error(err);

      toast.error(err.response?.data?.message || "Logout Failed");
    }
  };
  const {
    employees,
    setEmployees,
    editingEmployee,
    setEditingEmployee,
    fetchEmployees,

    searchTerm,
    setSearchTerm,

    selectedCompany,
    setSelectedCompany,

    selectedDomain,
    setSelectedDomain,

    currentPage,
    setCurrentPage,

    pageSize,
    setPageSize,

    totalPages,
    totalRecords,
  } = useEmployees();
  return (
    <>
      <Toaster position="top-center" />
      <div className="relative min-h-screen bg-[linear-gradient(135deg,#F8FAFC_0%,#EEF2FF_40%,#E0E7FF_100%)] overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl -z-10"></div>

        <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-sky-200/30 blur-3xl -z-10"></div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/20 blur-3xl -z-10"></div>

        <Header onLogout={handleLogout} />
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          <div className=" flex flex-col gap-5">
            <div className="h-full">
              <EmployeeForm
                employees={employees}
                setEmployees={setEmployees}
                fetchEmployees={fetchEmployees}
                editingEmployee={editingEmployee}
                setEditingEmployee={setEditingEmployee}
              />
            </div>
            <div className="lg:col-span-2">
              <UserDashboard
                employees={employees}
                setEditingEmployee={setEditingEmployee}
                fetchEmployees={fetchEmployees}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalPages={totalPages}
                totalRecords={totalRecords}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
