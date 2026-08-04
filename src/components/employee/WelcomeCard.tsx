import AttendanceButton from "./AttendanceButton";

interface Props {
  employee: any;
  onAttendanceMarked: () => void;
}

function WelcomeCard({
  employee,
  onAttendanceMarked,
}: Props) {
  return (
   <div
  className="
    fixed
    top-16
    left-0
    right-0
    z-30
    bg-slate-700
    text-white
    p-4
    shadow-lg
  "
>
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold">
            Welcome Back, {employee?.name}
          </h2>

          <p className="text-white/80 mt-2">
            Have a productive day ahead.
          </p>

          <div className="mt-6">
            <div className="bg-white/10 rounded-2xl p-4 w-fit min-w-[220px]">
              <h3 className="text-sm font-semibold">
                Employee ID
              </h3>

              <p className="text-2xl font-bold mt-1">
                {employee?.employeeId}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-end">
          <AttendanceButton
            onAttendanceMarked={onAttendanceMarked}
          />
        </div>

      </div>
    </div>
  );
}

export default WelcomeCard;