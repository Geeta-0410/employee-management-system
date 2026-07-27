import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SkillsBarChart from "../components/employee/SkillsBarChart";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../services/employeeDashboardService";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const getLevelText = (level: number) => {
  switch (level) {
    case 1:
      return "Beginner";

    case 2:
      return "Beginner+";

    case 3:
      return "Intermediate";

    case 4:
      return "Advanced";

    case 5:
      return "Expert";

    default:
      return "Unknown";
  }
};

function EmployeeSkills() {
  const [skills, setSkills] = useState<any[]>([]);

  const [skillName, setSkillName] = useState("");

  const [skillLevel, setSkillLevel] = useState(1);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);

  const loadSkills = async () => {
    try {
      const res = await getSkills();
      setSkills(res.data.skills);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load skills");
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateSkill(editingId, {
          name: skillName,
          level: skillLevel,
        });

        toast.success("Skill Updated");
      } else {
        await addSkill({
          name: skillName,
          level: skillLevel,
        });

        toast.success("Skill Added");
      }

      setSkillName("");
      setSkillLevel(50);
      setEditingId(null);

      loadSkills();
    } catch (error) {
      console.error(error);

      toast.error("Operation Failed");
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill._id);

    setSkillName(skill.name);

    setSkillLevel(skill.level);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);

      toast.success("Skill Deleted");

      loadSkills();
    } catch (error) {
      console.error(error);

      toast.error("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-700 px-8 py-8 rounded-b-2xl shadow-lg">
        <div className="ml-3 flex items-center gap-4">
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
            <h1 className="text-3xl font-bold text-white">Skills Management</h1>

            <p className="text-slate-300 mt-2">
              Add, update and manage your professional skills.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Form */}

        <div className="bg-slate-200 rounded-3xl shadow p-6 mt-4 mb-4">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Update Skill" : "Add New Skill"}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Skill Name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="border rounded-xl p-3"
              required
            />

            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(Number(e.target.value))}
              className="border rounded-xl p-3"
            >
              <option value={1}>Beginner</option>

              <option value={2}>Beginner+</option>

              <option value={3}>Intermediate</option>

              <option value={4}>Advanced</option>

              <option value={5}>Expert</option>
            </select>

            <button
              type="submit"
              className="
            bg-slate-800
            text-white
            rounded-xl
            p-3
            hover:bg-indigo-700
          "
            >
              {editingId ? "Update Skill" : "Add Skill"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-slate-200 rounded-3xl shadow p-6 m-8">
        <h2 className="text-xl font-semibold mb-4">Skills List</h2>

        <div className="overflow-x-auto ">
          <table className="w-full ">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 ">Skill</th>

                <th className="text-left py-3">Level</th>

                <th className="text-left py-3 px-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {skills.map((skill) => (
                <tr key={skill._id} className="border-b">
                  <td className="py-3">{skill.name}</td>

                  <td className="py-3">{getLevelText(skill.level)}</td>

                  <td className="py-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(skill)}
                      className=" px-3  py-1 rounded-lg  bg-blue-500 text-white    "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="
                        px-3
                        py-1
                        rounded-lg
                        bg-red-500
                        text-white
                      "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SkillsBarChart skills={skills} />
    </div>
  );
}

export default EmployeeSkills;
