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
    <div className="bg-gradient-to-slate-400 bg-slate-700 text-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ">

     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">

  <div>
    <h2 className="text-3xl md:text-4xl font-bold">
      Welcome Back, {employee?.name}
    </h2>

    <p className="text-white/90 mt-2">
      Have a productive day ahead.
    </p>
  </div>

  <AttendanceButton
    onAttendanceMarked={onAttendanceMarked}
  />

</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <h3 className="font-semibold text-sm">
            Employee ID
          </h3>

          <p className="text-xl font-bold">
            {employee?.employeeId}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

</div>
        

      </div>

    </div>
  );
}

export default WelcomeCard;