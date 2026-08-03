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
      <header className="bg-slate-800 shadow-md sticky top-0 z-50">
        <div className="px-8 h-20 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-white"
              >
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L18.8 8 12 11.8 5.2 8 12 4.2zm-7 5.5l6 3.3v6.5l-6-3.3V9.7zm8 9.8V13l6-3.3v6.5l-6 3.3z" />
              </svg>
            </div>
          </div>

          {/* CENTER */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Employee Management System
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200 transition"
              >
                <FiUser className="text-indigo-600 text-xl" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-6">
                  <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-indigo-100">
                        {selectedImage ? (
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="profile"
                            className="h-full w-full object-cover"
                          />
                        ) : user?.profileImage ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                            alt="profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-100">
                            <FiUser className="text-indigo-600 text-4xl" />
                          </div>
                        )}
                      </div>

                      {/* Camera Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700"
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

                    {/* Admin Info */}
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">
                      {user?.name || "Admin"}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-slate-600">
                      <FiMail />
                      <span>{user?.email}</span>
                    </div>

                    <div className="w-full -t my-4"></div>

                    {/* Optional Additional Details */}
                    <div className="w-full space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Role</span>
                        <span className="font-medium text-slate-800">
                          {user?.role || "Administrator"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Logout Button */}
                    {/* <button
                      onClick={() => {
                        setShowProfile(false);
                        setShowLogoutModal(true);
                      }}
                      className="mt-5 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
                    >
                      <FiLogOut />
                      Logout
                    </button> */}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition"
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
