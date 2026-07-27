import mongoose from "mongoose";
import { Request, Response } from "express";
import Attendance from "../models/Attendance";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
  };
};

const OFFICE_LOCATION = {
  latitude: Number(process.env.OFFICE_LATITUDE ?? 28.6139),
  longitude: Number(process.env.OFFICE_LONGITUDE ?? 77.209),
};
const ALLOWED_RADIUS_METRES = Number(
  process.env.ATTENDANCE_RADIUS_METRES ?? 30000,
);

const distanceInMetres = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const latitudeDifference = toRadians(latitude2 - latitude1);
  const longitudeDifference = toRadians(longitude2 - longitude1);
  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const markAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;
    const { latitude, longitude } = req.body;

    if (!employeeId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    console.log("========== Attendance API ==========");
    console.log(req.body);
    console.log(req.user);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      res.status(400).json({
        success: false,
        message: "A valid current location is required.",
      });
      return;
    }

    console.log("========== Attendance API ==========");
    console.log("Employee:", employeeId);

    console.log("Current Location:", {
      latitude,
      longitude,
    });

    console.log("Office Location:", OFFICE_LOCATION);

    const distance = distanceInMetres(
      latitude,
      longitude,
      OFFICE_LOCATION.latitude,
      OFFICE_LOCATION.longitude,
    );

    console.log("Current Location:", {
      latitude,
      longitude,
    });

    console.log("Office Location:", OFFICE_LOCATION);

    console.log("Distance:", distance);
    console.log("Allowed Radius:", ALLOWED_RADIUS_METRES);

    if (distance > ALLOWED_RADIUS_METRES) {
      res.status(403).json({
        success: false,
        message: "You can't mark attendance from this location.",
      });
      return;
    }

    // Today's Start Time (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tomorrow Start Time (00:00:00)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check if attendance already exists today
    const alreadyMarked = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (alreadyMarked) {
      res.status(400).json({
        success: false,
        message: "Attendance already marked today.",
      });
      return;
    }
    // Save Attendance
    const attendance = await Attendance.create({
      employeeId,
      status: "Absent",
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: "Day started successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getMonthlyAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;

    if (!employeeId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const monthlyAttendance = await Attendance.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
          status: "Present",
        },
      },
      {
        $group: {
          _id: {
            $month: "$date",
          },
          attendance: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = months.map((month, index) => {
      const found = monthlyAttendance.find((item) => item._id === index + 1);

      return {
        month,
        attendance: found ? found.attendance : 0,
      };
    });

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getCalendarAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;

    if (!employeeId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const startDate = new Date(year, month, 1);

    const endDate = new Date(year, month + 1, 1);

    const attendance = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTodayStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;

    if (!employeeId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    res.status(200).json({
      success: true,

      attendanceMarked: !!attendance,

      present: attendance?.status === "Present",

      checkedIn: attendance?.isCheckedIn || false,

      checkedOut: !attendance?.isCheckedIn,

      checkInTime: attendance?.checkInTime || null,

      checkOutTime: attendance?.checkOutTime || null,

      workedMinutes: attendance?.workedMinutes || 0,

      totalSessions: attendance?.sessions?.length || 0,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get status",
    });
  }
};

export const checkIn = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;

    if (!employeeId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (!attendance) {
      res.status(400).json({
        success: false,
        message: "Mark attendance first",
      });
      return;
    }

    if (attendance.isCheckedIn) {
      res.status(400).json({
        success: false,
        message: "Already checked in",
      });
      return;
    }

    const now = new Date();

    attendance.checkInTime = now;

    attendance.sessions.push({
      checkInTime: now,
    });

    attendance.isCheckedIn = true;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Checked in successfully",
      checkInTime: attendance.checkInTime,
      workedMinutes: attendance.workedMinutes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Check in failed",
    });
  }
};

export const checkOut = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;

    if (!employeeId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (!attendance) {
      res.status(404).json({
        success: false,
        message: "Attendance not found",
      });

      return;
    }

    if (!attendance.isCheckedIn || attendance.sessions.length === 0) {
      res.status(400).json({
        success: false,
        message: "Check in first",
      });

      return;
    }

    const activeSession = attendance.sessions[attendance.sessions.length - 1];

    if (activeSession.checkOutTime) {
      res.status(400).json({
        success: false,
        message: "No active session found",
      });

      return;
    }

    activeSession.checkOutTime = new Date();
    const checkInTime = activeSession.checkInTime;

    if (!checkInTime) {
      res.status(400).json({
        success: false,
        message: "Check in time missing",
      });

      return;
    }

    const checkOutTime = activeSession.checkOutTime!;

    const sessionMinutes = Math.floor(
      (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60),
    );

    activeSession.minutes = sessionMinutes;

    attendance.workedMinutes = attendance.sessions.reduce(
      (sum: number, session: any) => sum + (session.minutes || 0),
      0,
    );

    attendance.isCheckedIn = false;

    attendance.checkOutTime = activeSession.checkOutTime;

    if (attendance.workedMinutes >= 100) {
      attendance.status = "Present";
    } else {
      attendance.status = "Absent";
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Checked out successfully",

      sessionMinutes,

      workedMinutes: attendance.workedMinutes,

      status: attendance.status,

      present: attendance.status === "Present",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Check out failed",
    });
  }
};

export const getWorkHoursReport = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const employeeId = req.user?.userId;

    const data = await Attendance.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
        },
      },

      {
        $group: {
          _id: {
            $month: "$date",
          },

          avgHours: {
            $avg: {
              $divide: ["$workedMinutes", 60],
            },
          },

          totalHours: {
            $sum: {
              $divide: ["$workedMinutes", 60],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = months.map((month, index) => {
      const found = data.find((item) => item._id === index + 1);

      return {
        month,

        avgHours: found?.avgHours || 0,

        totalHours: found?.totalHours || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load report",
    });
  }
};
