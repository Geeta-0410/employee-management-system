import { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";

import ProfileDropdown from "./ProfileDropdown";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employee: any;
}

function EmployeeNavbar({ sidebarOpen, setSidebarOpen, employee }: Props) {
  const [showProfile, setShowProfile] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav
      className="
      bg-slate-700
      border-b
      border-slate-400
      shadow-sm
      h-16
      sticky
      top-0
      z-40"
    >
      <div className="h-full px-6 flex items-center">
        {/* Left */}

        <div className="w-64 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="
      p-2
      rounded-lg
      text-white
      hover:bg-slate-600
      transition
    "
          >
            <FaBars />
          </button>
        </div>

        {/* Center */}

        <div className="flex-1 flex justify-center">
          <div
            className="
      flex
      items-center
      gap-3
      bg-slate-100
      px-4
      py-2
      rounded-xl
      w-full
      max-w-xl
    "
          >
            <FaSearch />

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
        bg-transparent
        outline-none
        flex-1
        "
            />
          </div>
        </div>

        {/* Right */}

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="
            flex
            items-center
            gap-3
            text-white
            px-3
            py-2
            rounded-xl
            transition
          "
          >
            <div
              className="
              w-9
              h-9
              bg-slate-900
              text-white
              rounded-full
              flex
              items-center
              justify-center
              font-semibold
            "
            >
              {employee?.name?.charAt(0)?.toUpperCase() || "E"}
            </div>

            <span className="hidden md:block font-medium">
              {employee?.name || "Employee"}
            </span>
          </button>

          {showProfile && <ProfileDropdown employee={employee} />}
        </div>
      </div>
    </nav>
  );
}

export default EmployeeNavbar;
