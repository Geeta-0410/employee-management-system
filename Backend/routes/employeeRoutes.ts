import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getFilterOptions,
  updateEmployee,
  deleteEmployee,
  importUsers,
  getEmployeeProfile,
  updateEmployeeProfile,
  uploadProfileImage,
} from "../controllers/employeeController";
import { verifyAuth } from "../middleware/authMiddleware";
import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/employeeSkillController";
import upload from "../middleware/upload";

const router: Router = Router();

router.post("/", verifyAuth, createEmployee);
router.get("/", verifyAuth, getEmployees);

router.get("/import-users", importUsers);

router.get("/filter-options", verifyAuth, getFilterOptions);

router.get("/profile", verifyAuth, getEmployeeProfile);

router.put(
  "/profile/update",
  verifyAuth,
  upload.single("profileImage"),
  updateEmployeeProfile,
);

router.post(
  "/profile/upload",
  verifyAuth,
  upload.single("profileImage"),
  uploadProfileImage,
);

/* Skills Routes */

router.post("/skills", verifyAuth, addSkill);

router.get("/skills", verifyAuth, getSkills);

router.put("/skills/:skillId", verifyAuth, updateSkill);

router.delete("/skills/:skillId", verifyAuth, deleteSkill);

/* Employee Routes */

router.get("/:employeeId", verifyAuth, getEmployeeById);

router.put("/:employeeId", verifyAuth, updateEmployee);

router.delete("/:employeeId", verifyAuth, deleteEmployee);

export default router;
