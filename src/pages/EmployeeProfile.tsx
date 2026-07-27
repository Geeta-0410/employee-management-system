import { useState, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaSave, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../services/employeeService";
import toast from "react-hot-toast";

function EmployeeProfile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    experience: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getEmployeeProfile();

        setProfile({
          ...res.data.employee,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("bio", profile.bio);

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      const res = await updateEmployeeProfile(formData);

      setProfile(res.data.employee);

      toast.success("Profile Updated");
    } catch (error) {
      console.error(error);

      toast.error("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <div className="bg-slate-700 px-8 py-6 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-white p-2 rounded-full"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-white ">My Profile</h1>

              <p className="text-slate-300">Manage your profile information</p>
            </div>
          </div>

          <button
            onClick={async () => {
              if (isEditing) {
                await handleSaveProfile();
              }

              setIsEditing(!isEditing);
            }}
            className="bg-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <FaSave />
                Save
              </>
            ) : (
              <>
                <FaEdit />
                Edit
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Card */}

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <img
                src={
                  profile.profileImage
                    ? `${import.meta.env.VITE_API_URL ?? ""}${profile.profileImage}`
                    : "https://via.placeholder.com/150"
                }
                alt="profile"
                className="
      w-36
      h-36
      rounded-full
      object-cover
      border-4
      border-slate-200
    "
              />
              {isEditing && (
                <label
                  className="
      mt-4
      cursor-pointer
      bg-slate-700
      text-white
      px-4
      py-2
      rounded-xl
      flex
      items-center
      gap-2
    "
                >
                  <FaCamera />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProfileFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Info */}

            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="text-slate-500 mt-2">{profile.department}</p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Bio</h3>

                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                  />
                ) : (
                  <p className="text-slate-600">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}

        <div className="bg-white rounded-2xl shadow p-3 mt-4">
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-medium">First Name</label>

              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-medium">Last Name</label>

              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-medium">Email</label>

              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-medium">Phone</label>

              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>
          </div>
        </div>

        {/* Skills */}

        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Skills</h2>

          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
              React
            </span>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
              TypeScript
            </span>

            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
              Node.js
            </span>
          </div>
        </div>

        {/* Experience */}

        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Experience</h2>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold">Frontend Developer</h3>

            <p className="text-slate-500">Experience: {profile.experience}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
