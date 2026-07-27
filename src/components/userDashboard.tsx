import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import type { Employee } from "../types/employee";
import { deleteEmployee } from "../services/employeeService"
import {
  getFilterOptions
} from "../services/employeeService";

interface UserDashboardProps {
  employees: Employee[];

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
function UserDashboard({
  employees,
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
}: UserDashboardProps)
{
const [domain, setDomain] = useState<string[]>([]);
const [companyCount, setCompanyCount] =
    useState<Record<string, number>>({});
const [showDeleteModal, setShowDeleteModal] =
  useState(false);
const [employeeToDelete, setEmployeeToDelete] =
  useState<number | null>(null);

  const [companies, setCompanies] =
  useState<string[]>([]);

const [domains, setDomains] =
  useState<string[]>([]);

  useEffect(() => {

  const loadOptions =
    async () => {

      const res =
        await getFilterOptions();

    setCompanies(
      res.data.companies
  ),

      setDomains(
        res.data.domains
      );
    };

  loadOptions();

}, []);

  useEffect(() => {
    if (employees.length > 0) {
      findMostCommonDomain(employees);
      findCompanyCount(employees);}}, [employees]);
  const findMostCommonDomain = (
    data: Employee[]): void => {
    const map: Record<string, number> = {};
    data.forEach((user) => {
      const domainName =
        user.email?.split("@")[1] ?? "";
      if (domainName) {
        map[domainName] =
          (map[domainName] || 0) + 1;  } });
    let max = 0;
    Object.values(map).forEach((count) => {
      if (count > max) {
      max = count;  }});
    const commonDomains = Object.keys(map).filter(
      (key) => map[key] === max );
   setDomain(commonDomains);};
  const findCompanyCount = (
    data: Employee[]
  ): void => {
    const map: Record<string, number> = {};
    data.forEach((user) => {
      const company = user.company ?? "N/A";
      map[company] = (map[company] || 0) + 1;
    });
    setCompanyCount(map);};
 const handleEdit = (employee: Employee) => {
  setEditingEmployee(employee);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });};
const handleDelete = ( employeeId: number ) => {
console.log("delete clicked for EmployeeID:",employeeId)
  setEmployeeToDelete(employeeId);
  setShowDeleteModal(true);
};
const confirmDelete = async () => {
  try {
  console.log(
      "Deleting Employee ID:",
      employeeToDelete
    );    
if (employeeToDelete === null) return;
await deleteEmployee(employeeToDelete);
await fetchEmployees();
setShowDeleteModal(false);
setEmployeeToDelete(null);
toast.success("Employee deleted successfully");
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};

  return (
    <>
    <div className="bg-slate-50 rounded-[28px] border border-slate-200 shadow-sm sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
    <div className="mb-8 text-left">
   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        Employees
    </h2>
    <p className="text-slate-500 mt-1">
        Manage and view all registered employees
    </p>
</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Most Common Domain */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
           <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Most Common Domain
            </h2>
            <div className="flex flex-wrap gap-2">
              {domain.length > 0 ? (
                domain.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm" >
                   {d}
                  </span> 
                ))
              ) : (
                <span className="text-slate-400 text-sm">
                  N/A
                </span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
           <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Users Per Company
            </h2>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.keys(companyCount).length >
              0 ? (
                Object.keys(companyCount)
                  .sort()
                  .map((company) => (
                    <div
                      key={company}
                      className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
                      <span className="font-medium text-slate-700">
                        {company}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {companyCount[company]}
                      </span>
                    </div>
                  ))
              ) : (
                <span className="text-gray-400">
                  No data
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Employee Table */}
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
       <div>
    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        Employees Table 
    </h2>
    <p className="text-sm text-slate-500 mt-1">
    </p>
</div>
<div className="flex items-center gap-2 flex-wrap">
<input
  type="text"
  placeholder="Search employees..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }}
  className="w-42 px-4 py-2 border border-slate-200 rounded-xl"/>
<select
  value={selectedCompany}
  onChange={(e) => {
    setSelectedCompany(e.target.value);
    setCurrentPage(1);
  }}
 className="w-42 px-4 py-2 border border-slate-200 rounded-xl">
  <option value="all">
    All Companies
  </option>
  {[
    ...new Set(
      companies
    ),
  ].map((company) => (
    <option
      key={company}
      value={company}>
  
      {company}
    </option>
  ))}
</select>
<select
  value={selectedDomain}
  onChange={(e) => {
    setSelectedDomain(e.target.value);
    setCurrentPage(1);
  }}
  className="w-42 px-4 py-2 border border-slate-200 rounded-xl">
  <option value="all">
    All Domains
  </option>
  {[
    ...new Set(
      domains
    ),
  ].map((domain) => (
    <option
      key={domain}
      value={domain}>
      {domain}
    </option>
  ))}
</select>
<select
  value={pageSize}
  onChange={(e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }}
  className="w-42 px-4 py-2 border border-slate-200 rounded-xl"
>
  <option value={5}>5 Rows</option>
  <option value={10}>10 Rows</option>
  <option value={20}>20 Rows</option>
  <option value={50}>50 Rows</option>
</select>
</div>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100">
            <table className="min-w-[500px] w-full table-auto">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 shadow-sm">    
                <tr>
                  <th className="px-3 sm:px-6 py-5 text-left text-sm font-bold uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-5 text-left text-sm font-bold uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-5 text-left text-sm font-bold uppercase tracking-wide">
                    Company
                  </th>
                  <th className="px-3 sm:px-6 py-5 text-center text-sm font-bold uppercase tracking-wide">
                   Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map(  
                     (
                       user: Employee,
                       index: number
                             ) => {
                            const userDomain =
                                user.email?.split("@")[1] ?? "";
                             const isCommonDomain =
                                 domain.includes(
                                 userDomain
                                        );
                        return (
                          <tr
                            key={user.employeeId}
                            className={
                              isCommonDomain
                                ? "bg-white hover:bg-slate-50"
                                : index % 2 === 0
                                ? "bg-white hover:bg-slate-50 transition-colors duration-200"
                                : "bg-gray-50 hover:bg-slate-50 transition-colors duration-200"}>                      
                            <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-800">
                              {user.name}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold">
                                {user.company ??
                                  "N/A"}
                              </span>
                            </td>                         <td className="px-6 py-4 ">
                              <div className="flex justify-center items-center">
                              <button
                                onClick={() => handleEdit(user)}
                                className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200">                   
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(user.employeeId)}                        
                                className="ml-3 inline-flex items-center justify-center h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200">
                                <FiTrash2 size={18} />
                              </button>
                              </div>
                            </td>
                          </tr>
                        );})):
                   (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8  text-gray-500">
                      <p className="text-lg">
                        No users found. Add
                        employees using the
                        registration form above.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     </div>

<div className="flex items-center justify-between mt-6 px-4">

  <div>
    <p className="text-sm text-gray-600">
      Total Employees: {totalRecords}
    </p>
  </div>

  <div className="flex items-center gap-3">

    <span className="text-sm text-gray-600">
      Page {currentPage} of {Math.max(totalPages, 1)}
    </span>

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      disabled={currentPage <= 1}
      className={`px-4 py-2 rounded-lg border ${
        currentPage <= 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100"
      }`}
    >
      Previous
    </button>

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={
        totalPages === 0 ||
        currentPage >= totalPages
      }
      className={`px-4 py-2 rounded-lg border ${
        totalPages === 0 ||
        currentPage >= totalPages
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100"
      }`}
    >
      Next
    </button>
  </div>
</div>
      
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200">
         <h2 className="text-2xl font-bold text-slate-800 text-center">
            Delete Employee
          </h2>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. The employee record will be permanently deleted.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3 ">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}


export default UserDashboard;
