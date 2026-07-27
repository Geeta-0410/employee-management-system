import { FiLogOut, FiUser, FiMail, FiCamera } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { getCurrentUser, uploadProfileImage } from "../services/authServices";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  // ---------------- STATES ----------------
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ---------------- REFS ----------------
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- IMAGE SELECT ----------------
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <header className="bg-slate-700 border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="h-9 w-9 rounded-lg bg-indigo-400 border border-indigo-400 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* dashboard grid icon */}
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            Employee Management System
          </h1>
          <div className="flex items-center gap-5">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="h-11 w-11 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center hover:bg-indigo-200 transition"
              >
                <FiUser className="text-indigo-600 text-xl" />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-indigo-100">
                        {selectedImage ? (
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            className="h-full w-full object-cover"
                          />
                        ) : user?.profileImage ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL ?? ""}${user.profileImage}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                            <FiUser className="text-4xl text-indigo-600" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2"
                      >
                        <FiCamera size={14} />
                      </button>

                      <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleSelectImage}
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-800">
                      {user?.name || "user"}
                    </h3>

                    <div className="mt-4 text-slate-600 flex gap-2">
                      <FiMail /> {user?.email}
                    </div>

                    {/* <div className="mt-2 text-slate-600 flex gap-2">
                      <FiPhone /> {user?.phone || "Not Added"}
                    </div>

                    <div className="mt-2 text-slate-600 flex gap-2">
                      <FiBriefcase /> {user?.company || "Not Added"}
                    </div>

                    <div className="mt-4 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                      Role: {user?.role}
                    </div> */}

                    <div className="w-full  my-2"></div>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Are you sure you want to logout?
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              You will be redirected to login page.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                Yes Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
