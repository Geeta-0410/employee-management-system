import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { markAttendance } from "../../services/attendanceService";
import toast from "react-hot-toast";
import {
  getTodayStatus,
  checkIn,
  checkOut,
} from "../../services/attendanceService";
import { useEffect } from "react";

interface AttendanceButtonProps {
  onAttendanceMarked: () => void;
}
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  });
}
export default function AttendanceButton({
  onAttendanceMarked,
}: AttendanceButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [present, setPresent] = useState(false);

  const [checkedIn, setCheckedIn] = useState(false);

  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const [checkInTime, setCheckInTime] = useState("");

  const [timer, setTimer] = useState("00:00:00");
  const [workedMinutes, setWorkedMinutes] = useState(0);

  const handleMarkAttendance = async () => {
    console.log("Button Clicked");
    setStatus("loading");

    try {
      const position = await getCurrentPosition();
      console.log(position);
      console.log("Calling API...");
      await markAttendance(position.coords.latitude, position.coords.longitude);

      // Auto Check In
      // const checkInRes = await checkIn();

      // setCheckedIn(true);

      // setCheckInTime(checkInRes.data.checkInTime);

      setStatus("success");

      setAttendanceMarked(true);

      toast.success("Day Started Successfully");

      onAttendanceMarked();

      //  setPresent(true);
    } catch (error: any) {
      setStatus("error");

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to mark attendance.",
      );
    }
  };
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await getTodayStatus();

        setPresent(res.data.present);
        setAttendanceMarked(res.data.attendanceMarked);
        setCheckedIn(res.data.checkedIn);
        setWorkedMinutes(res.data.workedMinutes || 0);

        if (res.data.checkInTime) {
          setCheckInTime(res.data.checkInTime);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadStatus();
  }, []);
  useEffect(() => {
    console.log("checkedIn", checkedIn);
    console.log("checkInTime", checkInTime);

    if (!checkedIn || !checkInTime) return;

    console.log("Timer Started");

    const interval = setInterval(() => {
      console.log("Running");

      const start = new Date(checkInTime);
      const now = new Date();

      const previousSeconds = workedMinutes * 60;
      const currentSessionSeconds = Math.floor(
        (now.getTime() - start.getTime()) / 1000,
      );

      const totalSeconds = previousSeconds + currentSessionSeconds;

      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0",
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      setTimer(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkedIn, checkInTime, workedMinutes]);
  const handleCheckIn = async () => {
    try {
      if (!attendanceMarked) {
        const position = await getCurrentPosition();

        await markAttendance(
          position.coords.latitude,
          position.coords.longitude,
        );

        setAttendanceMarked(true);
      }

      const res = await checkIn();

      setCheckedIn(true);
      setCheckInTime(res.data.checkInTime);
      setWorkedMinutes(res.data.workedMinutes || 0);
      toast.success("Checked In");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Check In Failed");
    }
  };
  const handleCheckOut = async () => {
    try {
      const res = await checkOut();

      setCheckedIn(false);

      setCheckInTime("");

      setWorkedMinutes(res.data.workedMinutes);

      setPresent(res.data.present);

      toast.success("Checked Out");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Check Out Failed");
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 px-0 ">
      <button
        type="button"
        onClick={handleMarkAttendance}
        disabled={status === "loading" || attendanceMarked}
        className="
    inline-flex items-center gap-2
    rounded-lg bg-emerald-600
    px-4 py-1
    font-semibold text-white
    shadow
  "
      >
        <FaLocationArrow />

        {present
          ? "Present ✅"
          : status === "loading"
            ? "Checking location..."
            : attendanceMarked
              ? "Day Started ✅"
              : "Start Day"}
      </button>

      {/* CHECK IN */}

      <p className="font-bold text-green-600 text-lg">{timer}</p>

      <button
        onClick={() => {
          console.log("ACTION BUTTON CLICKED");

          if (checkedIn) {
            handleCheckOut();
          } else {
            handleCheckIn();
          }
        }}
        disabled={present || !attendanceMarked}
        className={`
    px-4 py-2 rounded-lg
    text-white font-medium
    ${checkedIn ? "bg-red-500" : "bg-blue-600"}
  `}
      >
        {checkedIn ? "Check Out" : "Check In"}
      </button>

      {/* COMPLETED */}
      <div className="flex flex-col items-center">
        <p className="font-bold text-green-600 text-lg">
          Worked: {Math.floor(workedMinutes / 60)}h {workedMinutes % 60}m
        </p>

        {present ? (
          <div className="text-green-700 font-semibold">Present ✅</div>
        ) : (
          <div className="text-red-600 font-semibold"></div>
        )}
      </div>
    </div>
  );
}
