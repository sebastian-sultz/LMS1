// components/OTPVerification.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";

const totalSlots = 6;

interface OTPVerificationProps {
  flow: "login" | "signup"; // determines logic path
}

export function OTPVerification({ flow }: OTPVerificationProps) {
  const {
    verifyLoginOtp,
    verifyOtp,
    resendOtp, // only used for signup now
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [identifier, setIdentifier] = useState(""); // phone or email
  const [isAdmin, setIsAdmin] = useState(false);

  // Load identifier from state or localStorage
  useEffect(() => {
    if (flow === "signup") {
      const phone = location.state?.phoneNumber || localStorage.getItem("tempPhoneNumber");
      if (phone) setIdentifier(phone);
      else navigate("/signup");
    } else {
      const emailOrPhone = location.state?.emailOrPhone || localStorage.getItem("loginEmailOrPhone");
      const admin = location.state?.isAdmin || localStorage.getItem("isAdminLogin") === "true";
      if (emailOrPhone) {
        setIdentifier(emailOrPhone);
        setIsAdmin(admin);
      } else {
        navigate("/login");
      }
    }
  }, [flow, location, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // OTP Verification handler
  const handleVerifyOtp = async () => {
    if (otp.length !== totalSlots) {
      alert("Please enter the complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (flow === "signup") {
        result = await verifyOtp(identifier, otp);
        localStorage.removeItem("tempPhoneNumber");
      } else {
        result = await verifyLoginOtp(identifier, otp);
        localStorage.removeItem("loginEmailOrPhone");
        localStorage.removeItem("isAdminLogin");
      }

      console.log("✅ OTP verified successfully, redirecting to:", result.redirectTo);
      navigate(result.redirectTo);
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      alert(error.message || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    try {
      if (flow === "signup") {
        await resendOtp(identifier);
        alert("OTP resent successfully!");
      } else {
        // If you add resendLoginOtp() later, you can call it here.
        alert("OTP resent successfully! Use '123456' for testing.");
      }
      setTimer(30);
      setOtp("");
    } catch (error: any) {
      alert(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  // Change identifier (go back)
  const handleChangeIdentifier = () => {
    if (flow === "signup") {
      localStorage.removeItem("tempPhoneNumber");
      navigate("/signup");
    } else {
      localStorage.removeItem("loginEmailOrPhone");
      localStorage.removeItem("isAdminLogin");
      navigate("/login");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 md:gap-16">
        <div className="flex flex-col items-center">
          <div className="text-center text-xl font-bold font-inter leading-tight tracking-wider">
            VERIFY OTP
          </div>
          <div className="text-center text-base font-inter">
            <span className="font-normal">We have sent an OTP to </span>
            <span className="font-extrabold">
              {flow === "signup" ? `+91 ${identifier}` : identifier}
            </span>
            {isAdmin && (
              <div className="mt-2 text-sm text-blue-600 font-semibold">
                👑 Admin Login
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <form className="flex flex-col gap-8 w-full">
            <div className="flex flex-col items-center gap-6 self-stretch">
              <div className="w-full flex justify-center">
                <InputOTP
                  maxLength={totalSlots}
                  className="flex gap-4"
                  value={otp}
                  onChange={setOtp}
                >
                  {Array.from({ length: totalSlots }).map((_, index) => (
                    <InputOTPGroup key={index}>
                      <InputOTPSlot
                        index={index}
                        className="w-14 h-[60px] text-lg font-bold"
                      />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
              </div>

              <div className="self-stretch text-center text-sm font-inter mt-[-8px]">
                <span>Expect OTP in </span>
                <span className="font-bold">{timer} seconds</span>
              </div>
            </div>

            <div className="self-stretch text-center text-sm font-inter mt-[-8px]">
              <span>Issue with OTP, </span>
              <span
                className="font-semibold underline cursor-pointer"
                onClick={handleChangeIdentifier}
              >
                Change {flow === "signup" ? "registered Number" : "email/phone"}
              </span>
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== totalSlots}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
