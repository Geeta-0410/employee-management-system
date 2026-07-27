import { useEffect, useRef, useState } from "react";
import { verifyOTP, resendOTP } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface OtpModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
}

export default function OtpModal({
  open,
  email,
  onClose,
}: OtpModalProps) {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (!open) return;
    setSeconds(10);

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  if (!open) return null;

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      const res = await verifyOTP({
        email,
        otp: enteredOtp,
      });

      toast.success(res.data.message);

      onClose();

      navigate("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "OTP Verification Failed"
      );
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);

      toast.success("OTP Sent Again");

      setSeconds(10);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-8">

        <h2 className="text-3xl font-bold text-center">
          Verify Email
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Enter the OTP sent to
        </p>

        <p className="font-semibold text-center mt-1 text-blue-600">
          {email}
        </p>

        <div className="flex justify-between mt-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  index
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-blue-500 outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Verify OTP
        </button>

        <div className="text-center mt-5">
          {seconds > 0 ? (
            <p className="text-gray-500">
              Resend OTP in{" "}
              <span className="font-bold">
                00:{seconds.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

      </div>

    </div>
  );
}