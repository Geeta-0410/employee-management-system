import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import Employee from "../models/employee";
import { sendEmployeeCredentialsEmail } from "../utils/sendEmail";
import { employeeSchema } from "../utils/employeeValidator";
import { getNextSequence } from "../utils/getNextSequence";
import { generateTempPassword } from "../utils/generateTempPassword";
import bcrypt from "bcrypt";

export const createEmployee = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  console.log("========== CREATE EMPLOYEE CONTROLLER CALLED ==========");
  try {
    const validationResult = employeeSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log(validationResult.error.flatten().fieldErrors);
      res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }
    const {
      name,
      email,
      phone,
      department,
      salary,
      skills,
      experience,
      company,
    } = validationResult.data;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const existingEmployee = await Employee.findOne({
      email,
      userId,
    });

    if (existingEmployee) {
      res.status(409).json({
        message: "Employee already exists with this email",
      });
      return;
    }
    const employeeId = await getNextSequence("employeeId");
    const tempPassword = generateTempPassword();

    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const employee = new Employee({
      employeeId,
      userId,
      name,
      email,
      phone,
      department,
      salary,
      skills,
      experience,
      company,
      password: hashedPassword,
      role: "employee",
      isFirstLogin: true,
      isEmailVerified: false,
    });
    await employee.save();
    console.log("==================================");
console.log("Employee saved successfully");
console.log("Sending email to:", email);

  const mailSent = await sendEmployeeCredentialsEmail(
  email,
  name,
  tempPassword
);
console.log("After sendEmployeeCredentialsEmail");

console.log("Calling sendMail...");
console.log("Mail Sent:", mailSent);


res.status(201).json({
  message: "Employee created successfully",
  employee,
  emailSent: mailSent
});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating employee:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};
export const importUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users",
    );
    for (const user of response.data) {
      const exists = await Employee.findOne({
        email: user.email,
      });
      if (!exists) {
        const employeeId = await getNextSequence("employeeId");
        await Employee.create({
          employeeId,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone.replace(/\D/g, "").slice(0, 10),
          department: "IT",
          salary: 50000,
          skills: "JavaScript, React",
          experience: 1,
          company: user.company?.name || "Unknown",
        });
      }
    }
    res.status(200).json({
      message: "Users imported successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Import failed",
    });
  }
};

export const getFilterOptions = async (
  req: Request & { user?: any },
  res: Response,
) => {
  const employees = await Employee.find({
    userId: req.user?.userId,
  });

  const companies = [...new Set(employees.map((e) => e.company))];
  const domains = [...new Set(employees.map((e) => e.email.split("@")[1]))];
  res.json({
    companies,
    domains,
  });
};

export const getEmployees = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    const {
      search = "",
      company = "",
      domain = "",
      page = "1",
      limit = "3",
    } = req.query;

    const filter: any = {
      userId: req.user?.userId,
    };
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (company && company !== "all") {
      filter.company = company;
    }

    if (domain && domain !== "all") {
      filter.email = {
        $regex: `@${domain}$`,
        $options: "i",
      };
    }

    const pageNumber = Number(page);

    const pageSize = Number(limit);

    const skip = (pageNumber - 1) * pageSize;

    const employees = await Employee.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalRecords = await Employee.countDocuments(filter);

    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({
      message: "Employees retrieved successfully",
      employees,
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};
export const getEmployeeProfile = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  console.log("req.user =>", req.user);

  try {
    const employee = await Employee.findById(req.user.userId).select(
      "-password",
    );
    console.log("Employee Found:", employee);

    if (!employee) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      employee,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

export const updateEmployeeProfile = async (
  req: Request & { user?: any; file?: any },
  res: Response,
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }

    if (req.body.bio) {
      employee.bio = req.body.bio;
    }

    if (req.file) {
      // Delete old image
      if (
        employee.profileImage &&
        employee.profileImage.startsWith("/uploads/")
      ) {
        const oldPath = path.join(
          process.cwd(),
          employee.profileImage.replace("/", ""),
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      employee.profileImage = `/uploads/${req.file.filename}`;
    }

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

export const uploadProfileImage = async (
  req: Request & {
    user?: any;
    file?: any;
  },
  res: Response,
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        message: "No image uploaded",
      });
      return;
    }

    employee.profileImage = `/uploads/${req.file.filename}`;

    await employee.save();

    res.status(200).json({
      success: true,
      profileImage: employee.profileImage,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

export const getEmployeeById = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    const employee = await Employee.findOne({
      employeeId: Number(req.params.employeeId),
      userId: req.user?.userId,
    });
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.status(200).json({
      message: "Employee retrieved successfully",
      employee,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};
export const changeEmployeePassword = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }
    const isMatch = await bcrypt.compare(currentPassword, employee.password);

    if (!isMatch) {
      res.status(400).json({
        message: "Invalid current password",
      });
      return;
    }
    employee.password = await bcrypt.hash(newPassword, 10);

    employee.isFirstLogin = false;
    await employee.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch {
    res.status(500).json({ message: "Change password failed" });
  }
};
export const updateEmployee = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: Number(req.params.employeeId), userId: req.user?.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!employee) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }
    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};
export const deleteEmployee = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeId: Number(req.params.employeeId),
      userId: req.user?.userId,
    });
    if (!employee) {
      res.status(404).json({
        message: "Employee not found",
      });
      return;
    }
    res.status(200).json({
      message: "Employee deleted successfully",
      employee,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};

export const addSkill = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { name, level } = req.body;

    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.skills.push({
      name,
      level,
    } as any);

    await employee.save();

    res.status(201).json({
      success: true,
      skills: employee.skills,
    });
  } catch (error) {
    console.error("ADD SKILL ERROR:", error);

    res.status(500).json({
      message: "Failed to add skill",
      error,
    });
  }
};
