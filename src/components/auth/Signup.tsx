import { useState } from "react";
import GoogleButton from "./GoogleButton";
import { signupUser } from "../../services/authServices";
import { loginWithGoogle } from "../../services/authServices";
import { Link ,useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import OtpModal from "./OtpModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Signup() {
  const navigate = useNavigate();


const [showOtpModal, setShowOtpModal] = useState(false);

// const [otp, setOtp] = useState("");

const [emailForOtp, setEmailForOtp] = useState("");

const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await signupUser(form);

    toast.success(res.data.message);

    setEmailForOtp(form.email);

    setShowOtpModal(true);

  } catch (err: any) {
  console.log(err);

  if (err.response) {
    console.log("Backend Response:", err.response.data);

    toast.error(
      err.response.data.message ||
      err.response.data.errors?.[0]?.message ||
      "Signup Failed"
    );
  } else if (err.request) {
    toast.error("Cannot connect to backend.");
  } else {
    toast.error(err.message);
  }
}
};

  return (
    <>
    <div className="min-h-screen bg-linear-to-r from-cyan-200 via-blue-100 to-indigo-300 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">

        <h1 className="text-4xl font-bold text-white- text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-white/80- mb-8">
          Signup to continue
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          <input
            placeholder="Name"
            className="w-full px-4 py-3 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-blue-600"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-blue-600"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

         <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-blue-600"
    value={form.password}
    onChange={(e) =>
      setForm({
        ...form,
        password: e.target.value,
      })
    }
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-blue-600"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />

          <button
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Create Account
          </button>

<GoogleButton
  onClick={async () => {
    try {
const response = await loginWithGoogle();

localStorage.setItem("token", response.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.user)
);

navigate("/");

    } catch (error) {
      console.error(error);
    }
  }}
/>

        </form>

        <p className="text-center text-white- mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline text-black"
          >
            Login
          </Link>
        </p>

      </div>

    </div>

<OtpModal
    open={showOtpModal}
    email={emailForOtp}
    onClose={() => setShowOtpModal(false)}
/>
</>

  );
}