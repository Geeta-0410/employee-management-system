import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaTasks,
  FaBars,
  FaClipboardList,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../common/LogoutModal";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EmployeeSidebar({ open, setOpen }: Props) {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };
  return (
    <div>
      <aside
        className={`
    ${open ? "translate-x-0" : "-translate-x-full"}

    fixed
    top-16
    left-0
    h-[calc(100vh-4rem)]
    w-64
    bg-slate-700
    text-white
    transition-all
    duration-300
    shadow-2xl
    z-50
  `}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            {/* <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(!open)}
                className=" p-2 rounded-lg hover:bg-slate-60 transition"
              >
                {open ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>

              <h2 className="text-2xl font-bold"></h2>
            </div> */}
          </div>

          <ul className="space-y-3">
           <Link
  to="/employee"
  className="flex items-center gap-3 hover:bg-slate-800 rounded-xl px-4 py-3 transition"
>
  <FaHome />
  Dashboard
</Link>

            <Link
              to="/employee/profile"
              className="
    flex items-center gap-3
    hover:bg-slate-800
    rounded-xl px-4 py-3
    transition
  "
            >
              <FaUser />
              My Profile
            </Link>
            <Link
              to="/employee/attendance"
              className="flex items-center gap-3 hover:bg-slate-800 rounded-xl px-4 py-3 transition"
            >
              <FaClipboardList />
              Attendance
            </Link>

            <Link
              to="/employee/skills"
              className="
        flex items-center gap-3
         hover:bg-slate-800
        rounded-xl px-4 py-3
         transition
         "
            >
              <FaLaptopCode />
              Skills
            </Link>

            <Link
              to="/employee/tasks"
              className="flex items-center gap-3 hover:bg-slate-800 rounded-xl px-4 py-3 transition"
            >
              <FaTasks />
              Tasks
            </Link>
            <Link
              to="/employee/chat"
              className="flex items-center gap-3 hover:bg-slate-800 rounded-xl px-4 py-3 transition"
            >
              <FaRobot />
              AI Chatbot
            </Link>

            <li
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-3 mt-10 text-red-400 hover:bg-red-500/20 rounded-xl px-4 py-3 transition cursor-pointer"
            >
              <FaSignOutAlt />
              Logout
            </li>
          </ul>
        </div>
      </aside>
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default EmployeeSidebar;
