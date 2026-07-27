import { z } from "zod";
import { wordsToNumbers } from "words-to-numbers";

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name can contain only letters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .regex(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "Email must contain only lowercase letters",
    ),

  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  department: z.enum([
    "HR",
    "Finance",
    "IT",
    "Marketing",
    "Sales",
    "Operations",
  ]),

  salary: z.preprocess((value) => {
    if (typeof value === "string") {
      const converted = wordsToNumbers(value);

      if (typeof converted === "number") {
        return converted;
      }

      const parsed = Number(value);
      return isNaN(parsed) ? value : parsed;
    }

    return value;
  }, z.number().positive("Salary must be greater than 0")),
  experience: z
    .number()
    .refine((val) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(val), {
      message: "Invalid experience value",
    }),

  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      level: z.number().min(1).max(5),
    }),
  ),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(50, "Company name is too long"),
});
