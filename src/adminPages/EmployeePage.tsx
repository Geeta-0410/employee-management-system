import { useState } from "react";
import EmployeeTable from "../components/adminEmployee/EmployeeTable";
import EmployeeDrawer from "../components/adminEmployee/EmployeeDrawer";
import type { Employee } from "../types/employee";

interface Props {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;

  editingEmployee: Employee | null;
  setEditingEmployee: React.Dispatch<
    React.SetStateAction<Employee | null>
  >;

  fetchEmployees: () => Promise<void>;

  searchTerm: string;
  setSearchTerm: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedCompany: string;
  setSelectedCompany: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedDomain: string;
  setSelectedDomain: React.Dispatch<
    React.SetStateAction<string>
  >;

  currentPage: number;
  setCurrentPage: React.Dispatch<
    React.SetStateAction<number>
  >;

  pageSize: number;
  setPageSize: React.Dispatch<
    React.SetStateAction<number>
  >;

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
  const [openDrawer, setOpenDrawer] =
    useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Employees
          </h1>

          <p className="text-slate-500 mt-1">
            Manage employee records
          </p>
        </div>

        <button
          onClick={() => setOpenDrawer(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Add Employee
        </button>
      </div>

      <EmployeeTable
        employees={employees}
        setEditingEmployee={setEditingEmployee}
          setOpenDrawer={setOpenDrawer}
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

      <EmployeeDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        employees={employees}
        setEmployees={setEmployees}
        fetchEmployees={fetchEmployees}
        editingEmployee={editingEmployee}
        setEditingEmployee={setEditingEmployee}
      />
    </>
  );
}