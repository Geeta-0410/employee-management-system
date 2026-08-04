import AttendanceLineChart from "../components/employee/AttendanceLineChart";
import AttendanceMap from "../components/employee/AttendanceMap";
import AttendanceButton from "../components/employee/AttendanceButton";
import AttendanceCalendar from "../components/employee/AttendanceCalendar";
import { useState } from "react";
import useCurrentLocation from "../hooks/useCurrentLoaction";
import { OFFICE_LOCATION } from "../utils/officeLocation";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Attendance() {
  const { location } = useCurrentLocation();
  const [refreshChart, setRefreshChart] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-slate-100">
      {/* Header */}     
         <div
  className="
    fixed
    top-0
    left-0
    right-0
    z-30
    bg-slate-700
    px-8
    py-8
    rounded-b-3xl shadow-lg
  "
> 
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="
          bg-white
          p-2
          rounded-full
          text-slate-800
          hover:bg-slate-200
          transition
        "
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-white pt-2">
                Attendance Management
              </h1>

              <p className="text-slate-300 mt-2">
                Monitor monthly attendance records and employee presence.
              </p>
            </div>
          </div>

          <AttendanceButton
            onAttendanceMarked={() => setRefreshChart((prev) => !prev)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Details */}

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">Attendance Details</h2>

            <p className="mb-3">
              <strong>Current Location</strong>
              <br />

              {location
                ? `${location.latitude}, ${location.longitude}`
                : "Loading..."}
            </p>

            <p className="mb-5">
              <strong>Office Location</strong>
              <br />
              {OFFICE_LOCATION.latitude}, {OFFICE_LOCATION.longitude}
            </p>

            <button
              onClick={() => setShowMap(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              View Office Map
            </button>
          </div>

          {/* Attendance Calendar */}

          <AttendanceCalendar refresh={refreshChart} />
        </div>

        {/* Line Chart */}

        <div className="mt-6">
          <AttendanceLineChart refresh={refreshChart} />
        </div>

        {showMap && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-5xl rounded-xl p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">Office Map</h2>

                <button
                  onClick={() => setShowMap(false)}
                  className="text-red-500 text-xl"
                >
                  ✕
                </button>
              </div>

              {location && (
                <AttendanceMap
                  latitude={location.latitude}
                  longitude={location.longitude}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
