import { FiX } from "react-icons/fi";
import EmployeeForm from "./employeeForm";
import type { Employee } from "../../types/employee";

interface EmployeeDrawerProps {
  open: boolean;
  onClose: () => void;

  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;

  fetchEmployees: () => Promise<void>;

  editingEmployee: Employee | null;
  setEditingEmployee: React.Dispatch<
    React.SetStateAction<Employee | null>
  >;
}

export default function EmployeeDrawer({
  open,
  onClose,
  employees,
  setEmployees,
  fetchEmployees,
  editingEmployee,
  setEditingEmployee,
}: EmployeeDrawerProps) {
  if (!open) return null;

 return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Center Modal */}
    <div className="relative w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">


        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editingEmployee
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Fill employee details and save changes.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingEmployee(null);
              onClose();
            }}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <EmployeeForm
            employees={employees}
            setEmployees={setEmployees}
            fetchEmployees={fetchEmployees}
            editingEmployee={editingEmployee}
            setEditingEmployee={setEditingEmployee}
          />
        </div>
      </div>
    </div>
  );
}