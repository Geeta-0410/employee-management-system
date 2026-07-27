import express from "express";
import {  markAttendance, getMonthlyAttendance, getCalendarAttendance, getTodayStatus,checkIn, checkOut, getWorkHoursReport,} from "../controllers/attendanceController";
import { verifyAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/mark", verifyAuth, markAttendance);
router.get("/monthly", verifyAuth, getMonthlyAttendance);
router.get("/calendar", verifyAuth, getCalendarAttendance);
router.get( "/today-status", verifyAuth,getTodayStatus);
router.post( "/checkin", verifyAuth,checkIn);
router.post("/checkout", verifyAuth, checkOut);
router.get( "/work-hours-report",verifyAuth, getWorkHoursReport);
export default router;