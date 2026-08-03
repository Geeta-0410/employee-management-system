import { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Employee } from "../../types/employee";
import { createEmployee, updateEmployee } from "../../services/employeeService";
import { employeeSchema } from "../validation/employeeScheema";

interface EmployeeFormProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  fetchEmployees: () => Promise<void>;
  editingEmployee: Employee | null;
  setEditingEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
}

function EmployeeForm({
  employees,
  fetchEmployees,
  editingEmployee,
  setEditingEmployee,
}: EmployeeFormProps){
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      salary: 0,
      experience: 0,
      skills: [
        {
          name: "",
          level: 1,
        },
      ],
      company: "",
    },
  });

  useEffect(() => {
    if (editingEmployee) {
      reset({
        name: editingEmployee.name ?? "",
        email: editingEmployee.email ?? "",
        phone: editingEmployee.phone ?? "",
        department: (editingEmployee.department as any) ?? "",
        salary: Number(editingEmployee.salary) || 0,
        experience: Number(editingEmployee.experience) || 0,
        skills: editingEmployee.skills ?? [ { name: "", level: 1 } ],
        company: editingEmployee.company ?? "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        department: "",
        salary: 0,
        experience: 0,
        skills: [ { name: "", level: 1 } ],
        company: "",
      });
    }
  }, [editingEmployee, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (!editingEmployee) {
        const emailExists = employees.some(
          (emp) => emp.email.trim().toLowerCase() === data.email.trim().toLowerCase()
        );

        if (emailExists) {
          toast.error("Employee with this email already exists");
          return;
        }
      }

      if (editingEmployee) {
        await updateEmployee(editingEmployee.employeeId, data);
        toast.success("Employee updated successfully");
        setEditingEmployee(null);
      } else {
        await createEmployee(data);
        toast.success("Employee added successfully");
      }

      await fetchEmployees();
      reset({
        name: "",
        email: "",
        phone: "",
        department: "",
        salary: 0,
        experience: 0,
        skills: [ { name: "", level: 1 } ],
        company: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 " >
        <div className="mb-8 text-left ">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>
          <p className="text-slate-500 text-base mt-2">Fill in the details to register a new employee</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input type="text" placeholder="Name*" {...register("name")} className={`w-full px-4 py-3.5 rounded-xl border ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
            {errors.name && <p className="text-red-500 text-xs font-medium mt-1">{String(errors.name.message)}</p>}
          </div>

          <div>
            <input type="email" placeholder="Email*" {...register("email")} className={`w-full px-4 py-3.5 rounded-xl border ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>}
          </div>

          <div>
            <input type="text" placeholder="Phone* (10 digits)" {...register("phone")} className={`w-full px-4 py-3.5 rounded-xl border ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{String(errors.phone.message)}</p>}
          </div>

          <div>
            <select {...register("department")} className={`w-full px-4 py-3.5 rounded-xl border ${errors.department ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
              <option value="">Select Department*</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{String(errors.department.message)}</p>}
          </div>

          <div>
            <input type="number" placeholder="Salary*" {...register("salary", { valueAsNumber: true })} className={`w-full px-4 py-3.5 rounded-xl border ${errors.salary ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
            {errors.salary && <p className="text-red-500 text-sm mt-1">{String(errors.salary.message)}</p>}
          </div>

          <div>
            <select {...register("experience", { valueAsNumber: true })} className={`w-full px-4 py-3.5 rounded-xl border ${errors.experience ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
              <option value="">Select Experience *</option>
              <option value={0}>Fresher</option>
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={4}>4 Years</option>
              <option value={5}>5 Years</option>
              <option value={10}>10+ Years</option>
            </select>
            {errors.experience && <p className="text-red-500 text-sm mt-1">{String(errors.experience.message)}</p>}
          </div>

          <div>
            <input type="text" placeholder="Skill Name" {...register("skills.0.name")} className={`w-full px-4 py-3.5 rounded-xl border ${errors.skills?.[0]?.name ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
            {errors.skills?.[0]?.name && <p className="text-red-500 text-sm mt-1">{String(errors.skills?.[0]?.name?.message)}</p>}
          </div>

          <div>
            <select {...register("skills.0.level", { valueAsNumber: true })} className={`w-full px-4 py-3.5 rounded-xl border ${errors.skills?.[0]?.level ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
              <option value={1}>Beginner</option>
              <option value={2}>Beginner+</option>
              <option value={3}>Intermediate</option>
              <option value={4}>Advanced</option>
              <option value={5}>Expert</option>
            </select>
            {errors.skills?.[0]?.level && <p className="text-red-500 text-sm mt-1">{String(errors.skills?.[0]?.level?.message)}</p>}
          </div>

          <div>
            <input type="text" placeholder="Company*" {...register("company")} className={`w-full px-4 py-3.5 rounded-xl border ${errors.company ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
            {errors.company && <p className="text-red-500 text-sm mt-1">{String(errors.company.message)}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className={`col-span-1 md:col-span-2 w-full py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-slate-700  text-white hover:scale-100 hover:shadow-lg cursor-pointer"}`}>
            {isSubmitting ? "Processing..." : editingEmployee ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
