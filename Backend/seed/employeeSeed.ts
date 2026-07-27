import Employee from "../models/employee";
import User from "../models/user";
import { getNextSequence } from "../utils/getNextSequence";

export const seedEmployees = async () => {
  try {
    // Check if employees already exist
    const count = await Employee.countDocuments();

    if (count > 0) {
      // console.log(" Employees already seeded");
      return;
    }

    // Check if demo user exists
    let user = await User.findOne({
      email: "admin@gmail.com",
    });

    // Create demo user if not exists
    if (!user) {
      user = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: "Admin@123",
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Demo User Created");
    }

    const employees = [
      {
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        phone: "9876543210",
        department: "IT",
        salary: 75000,
        experience: 3,
        skills: "React, Node",
        company: "Infosys",
      },
      {
        name: "Priya Verma",
        email: "priya@gmail.com",
        phone: "9123456780",
        department: "HR",
        salary: 60000,
        experience: 2,
        skills: "Recruitment",
        company: "TCS",
      },
      {
        name: "Amit Singh",
        email: "amit@gmail.com",
        phone: "9988776655",
        department: "Finance",
        salary: 80000,
        experience: 5,
        skills: "Accounting",
        company: "Wipro",
      },
      {
        name: "Neha Gupta",
        email: "neha@gmail.com",
        phone: "9876501234",
        department: "Marketing",
        salary: 70000,
        experience: 4,
        skills: "SEO",
        company: "Accenture",
      },
    ];

    // Insert Employees
    for (const emp of employees) {
      const employeeId = await getNextSequence("employeeId");

      await Employee.create({
        employeeId,
        userId: user._id,
        ...emp,
      });
    }

    console.log("✅ Demo Employees Seeded Successfully");
  } catch (error) {
    console.error("Seed Error:", error);
  }
};