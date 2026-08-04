import {
  FaBuilding,
  FaBriefcase,
  FaLaptopCode,
  FaLayerGroup,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Props {
  employee: any;
}

function EmployeeStats({ employee }: Props) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Experience */}

      <div className="bg-white border border-blue-100 rounded-3xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Experience</p>

            <h3 className="text-xl font-bold text-blue-500 mt-2">
              {employee?.experience}
            </h3>

            <p className="text-slate-500 mt-1">Years</p>
          </div>

          <FaBriefcase size={30} className="text-blue-500 mt-0.5" />
        </div>
      </div>

      {/* Skills */}

      <div className="bg-white border border-blue-100 rounded-3xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between ">
          <div>
            <p className="text-slate-500 text-sm">Skills</p>

            <h3 className="text-md font-bold text-purple-500 mt-2">
              {employee?.skills?.length || 0}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {employee?.skills?.map(
                (skill: { name: string; level: number }) => (
                  <span
                    key={skill.name}
                    className="px-2 py-1 bg-purple-100 text-purple-500 rounded-lg text-sm"
                  >
                    {skill.name}
                  </span>
                ),
              )}
            </div>
          </div>

          <FaLaptopCode
            size={50}
            className="text-purple-500 cursor-pointer hover:scale-110 transition-transform duration-200 mt-2"
            onClick={() => navigate("/employee/skills")}
          />
        </div>
      </div>

      {/* Department */}

      <div className="bg-white border border-blue-100 rounded-3xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Department</p>

            <h3 className="text-md font-bold text-emerald-500 mt-2">
              {employee?.department}
            </h3>
          </div>

          <FaLayerGroup size={30} className="text-emerald-400" />
        </div>
      </div>

      {/* Company */}

      <div className="bg-white border border-blue-100 rounded-3xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Company</p>

            <h3 className="text-md font-bold text-orange-600 mt-2">
              {employee?.company}
            </h3>
          </div>

          <FaBuilding size={30} className="text-orange-400" />
        </div>
      </div>
    </div>
  );
}

export default EmployeeStats;
