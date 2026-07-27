import { Request, Response } from "express";
import Employee from "../models/employee";

export const addSkill = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const { name, level } = req.body;

    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.skills.push({ name, level });

    await employee.save();

    res.status(201).json({
      success: true,
      skills: employee.skills,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add skill",
    });
  }
};
export const getSkills = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    console.log("User:", req.user);

    const employee = await Employee.findById(req.user.userId);

    console.log("Employee:", employee);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      skills: employee.skills,
    });
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);

    res.status(500).json({
      message: "Failed to get skills",
    });
  }
};
export const updateSkill = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const { name, level } = req.body;
    const { skillId } = req.params;
    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const skill = employee.skills.find(
      (skill: any) => skill._id.toString() === skillId,
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }
    skill.name = name;
    skill.level = level;
    await employee.save();

    res.status(200).json({
      success: true,
      skills: employee.skills,
    });
  } catch {
    res.status(500).json({
      message: "Failed to update skill",
    });
  }
};
export const deleteSkill = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const { skillId } = req.params;
    const employee = await Employee.findById(req.user.userId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }
    employee.skills = employee.skills.filter(
      (skill: any) => skill._id.toString() !== skillId,
    ) as any;

    await employee.save();

    res.status(200).json({
      success: true,
      skills: employee.skills,
    });
  } catch {
    res.status(500).json({
      message: "Failed to delete skill",
    });
  }
};
