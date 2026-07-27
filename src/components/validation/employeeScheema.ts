import {z} from 'zod';
export const employeeSchema = z.object({
  
name: z
.string()
.trim()
.min(2, "Name is required")
.regex(
/^[a-zA-Z\s]+$/,
"Name can contain only letters"
),
email: z
  .string()
  .trim()
  .email("Invalid email address")
  .regex(
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    "Email must contain only lowercase letters"
  ),
 phone: z
.string()
.regex(
/^\d{10}$/,
"Phone number must be exactly 10 digits"
),
  department: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(
      ["HR", "Finance", "IT", "Marketing", "Sales", "Operations"],
      {
        message: "Please select department",
      }
    )
  ),
  salary: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive("Salary must be greater than 0")
  ),

experience: z.coerce
    .number()
    .min(0, "Please select experience")
    .refine(
      (val) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(val),
      {
        message: "Experience must be between 0 and 10 years",
      }
    ),
  skills: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Skill name is required"),
        level: z.number().min(1).max(5),
      })
    )
    .min(1, "Skills are required"),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(100, "Company must be less than 100 characters"),

});
export type EmployeeFormData = z.infer<typeof employeeSchema>;

