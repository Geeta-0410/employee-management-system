import { useEffect, useState } from "react";
import type { Employee } from "../types/employee";
import { getEmployees } from "../services/employeeService";

export default function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");

  const [selectedDomain, setSelectedDomain] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  const [totalRecords, setTotalRecords] = useState(0);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async (): Promise<void> => {
    try {
      const response = await getEmployees({
        search: searchTerm,
        company: selectedCompany,
        domain: selectedDomain,
        page: currentPage,
        limit: pageSize,
      });

      setEmployees(response.data.employees);

      setTotalPages(response.data.totalPages);

      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, selectedCompany, selectedDomain, currentPage, pageSize]);

  return {
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
    setTotalPages,
    totalRecords,
    setTotalRecords,
  };
}
