import { FaUserCircle, FaEnvelope, FaPhone,FaBuilding,  FaLayerGroup, FaIdBadge,} from "react-icons/fa";

interface Props {
  employee: any;
}

function ProfileDropdown({
  employee,
}: Props) {
  return (
    <div className=" absolute right-0 top-16 w-80  bg-white rounded-3xl  shadow-2xl border z-50  overflow-hidden ">
      {/* Header */}

      <div className="bg-slate-700 p-8 text-white">

        <div className="flex items-center gap-4 ">

          <div className="bg-white text-indigo-600 rounded-full p-3">
            <FaUserCircle size={40} />
          </div>
     
          <div>
            <h2 className="font-bold text-xl">
              {employee?.name}
            </h2>

            <p className="text-sm text-white/90">
              {employee?.designation ||
                "Employee"}
            </p>
          </div>

        </div>

      </div>

      {/* Profile Details */}

      <div className="p-5 space-y-4">

        <div className="flex items-center gap-3">

          <FaEnvelope className="text-blue-500" />

          <span className="text-sm text-slate-700">
            {employee?.email}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <FaPhone className="text-green-500" />

          <span className="text-sm text-slate-700">
            {employee?.phone}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <FaIdBadge className="text-purple-500" />

          <span className="text-sm text-slate-700">
            {employee?.employeeId}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <FaBuilding className="text-orange-500" />

          <span className="text-sm text-slate-700">
            {employee?.company}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <FaLayerGroup className="text-cyan-500" />

          <span className="text-sm text-slate-700">
            {employee?.department}
          </span>

        </div>

      </div>

      {/* Footer */}

      {/* <div className="border-t p-4">

        <button
          className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          bg-red-500
          hover:bg-red-600
          text-white
          py-3
          rounded-xl
          transition
        "
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div> */}
    </div>
  );
}

export default ProfileDropdown;