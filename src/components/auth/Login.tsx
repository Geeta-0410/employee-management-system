import { useState } from "react";
import GoogleButton from "./GoogleButton";
import { loginUser,employeeLogin} from "../../services/authServices";
import { loginWithGoogle } from "../../services/authServices";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("admin");
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

let res;
if (loginType === "admin") {
  res = await loginUser({
    email,
    password,
  });
  localStorage.setItem(
    "token",
    res.data.token
  );
  localStorage.setItem(
    "role",
    res.data.user.role
  );
  toast.success(
    "Admin Login Successful"
  );
  navigate("/");
} else {
  res = await employeeLogin({
    email,
    password,
  });
  localStorage.setItem(
    "token",
    res.data.token
  );
  localStorage.setItem(
    "role",
    res.data.role
  );
  toast.success(
    "Employee Login Successful"
  );
  if (res.data.isFirstLogin) {
    navigate("/change-password");
  } else {
    navigate("/employee-dashboard");
  }
}
    } catch (err: any) {
  console.error(err);

  toast.error(
    err.response?.data?.message || "Login Failed"
  );
}
  };
  return (
    <div className="min-h-screen bg-linear-to-r from-cyan-200 via-blue-100 to-indigo-300 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40  sm:p-8" >

        <h1 className="text-4xl font-bold text-white- text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-white/80- mb-8 sm:text-base">
          Login to your account
        </p>

        <form onSubmit={handleLogin}
        autoComplete="off"
         className="space-y-5">

          <select
  value={loginType}
  onChange={(e) =>
    setLoginType(e.target.value)
  }
  className="w-full px-4 py-3 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-indigo-500"
>
  <option value="admin">
    Login as Admin
  </option>

  <option value="employee">
    Login as Employee
  </option>
</select>
  
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-indigo-500 autoComplete=off"
            value={email}
            onChange={(e) => { setEmail(e.target.value);setError("");}}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl bg-white/90 outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) =>{ setPassword(e.target.value);setError("");}}
          />

          {error && (
  <div className="flex items-center gap-2 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700 text-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
      />
    </svg>

    <span>{error}</span>
  </div>
)}

          <button
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Login
          </button>

<GoogleButton
  onClick={async () => {
   if (
      loginType === "employee"
    ) {
      toast.error(
        "Employees cannot login with Google"
      );
      return;
    }

    try {
      const res = await loginWithGoogle();

      console.log("Google Login Response:", res);

      localStorage.setItem("token", res.token);
      
     localStorage.setItem("role",res.user.role);


      toast.success("Google Login Successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err: any) {
  console.error(err);

  const message =
    err.response?.data?.message ||
    "Incorrect email or password";

  setError(message);

  toast.error(message);
}
  }}
/>
        </form>

        <p className="text-center text-white- mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold underline text-black"
          >
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}