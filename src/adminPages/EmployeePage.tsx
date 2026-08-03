import EmployeeTable from "../components/adminEmployee/EmployeeTable";
// import EmployeeDrawer from "../components/adminEmployee/EmployeeDrawer";
import type { Employee } from "../types/employee";
import EmployeeForm from "../components/adminEmployee/employeeForm";

interface Props {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;

  editingEmployee: Employee | null;
  setEditingEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;

  fetchEmployees: () => Promise<void>;

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  selectedCompany: string;
  setSelectedCompany: React.Dispatch<React.SetStateAction<string>>;

  selectedDomain: string;
  setSelectedDomain: React.Dispatch<React.SetStateAction<string>>;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;

  totalPages: number;
  totalRecords: number;
}

export default function EmployeePage({
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
}: Props) {
  return (
    <>
      
      <EmployeeTable
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
      <div id="employee-form" className="mt-8">
        <EmployeeForm
          employees={employees}
          setEmployees={setEmployees}
          fetchEmployees={fetchEmployees}
          editingEmployee={editingEmployee}
          setEditingEmployee={setEditingEmployee}
        />
      </div>
    </>
  );
}
