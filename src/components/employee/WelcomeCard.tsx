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
<div className="bg-slate-700 text-white rounded-3xl p-4 shadow-lg mt-0">

  <div className="flex justify-between items-start">

    <div>
      <h2 className="text-3xl font-bold">
        Welcome Back, {employee?.name}
      </h2>

      <p className="text-white/90 mt-1">
        Have a productive day ahead.
      </p>
    </div>

    <div>
      <AttendanceButton
        onAttendanceMarked={onAttendanceMarked}
      />
    </div>

  </div>

  <div className="mt-6">
    <div className="bg-white/10 rounded-2xl p-4 w-[260px]">
      <h3 className="text-sm font-semibold">
        Employee ID
      </h3>

      <p className="text-xl font-bold">
        {employee?.employeeId}
      </p>
    </div>
  </div>

</div>
  );
}

export default WelcomeCard;