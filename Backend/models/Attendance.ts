import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;

  status: "Present" | "Absent";

  date: Date;

  latitude: number;

  longitude: number;

  checkInTime?: Date;

  checkOutTime?: Date;

  workedMinutes?: number;

  isCheckedIn?: boolean;

  minutes?: number;

  sessions: IAttendanceSession[];
}

export interface IAttendanceSession {
  checkInTime?: Date;
  checkOutTime?: Date;
  minutes?: number;
}

const attendanceSessionSchema = new Schema(
  {
    checkInTime: {
      type: Date,
      required: true,
    },

    checkOutTime: {
      type: Date,
    },

    minutes: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const attendanceSchema = new Schema<IAttendance>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },
    checkInTime: {
      type: Date,
    },

    checkOutTime: {
      type: Date,
    },

    workedMinutes: {
      type: Number,
      default: 0,
    },

    isCheckedIn: {
      type: Boolean,
      default: false,
    },

    sessions: {
      type: [attendanceSessionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAttendance>("Attendance", attendanceSchema);
