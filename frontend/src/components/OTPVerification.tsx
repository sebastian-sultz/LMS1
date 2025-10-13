// components/OTPVerification.tsx
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

const totalSlots = 6;

export function OTPVerification() {
  const { verifyOtp, verifyLoginOtp, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoginFlow, setIsLoginFlow] = useState(false);

  // Detect flow type (signup or login)
  useEffect(() => {
    if (location.state?.phoneNumber) {
      setEmailOrPhone(location.state.phoneNumber);
      setIsLoginFlow(false);
      localStorage.setItem("otpPhoneNumber", location.state.phoneNumber);
    } else if (location.state?.emailOrPhone) {
      setEmailOrPhone(location.state.emailOrPhone);
      setIsLoginFlow(true);
      localStorage.setItem("otpEmailOrPhone", location.state.emailOrPhone);
    } else {
      // Try localStorage backup
      const storedPhone = localStorage.getItem("otpPhoneNumber");
      const storedEmail = localStorage.getItem("otpEmailOrPhone");
      if (storedPhone) {
        setEmailOrPhone(storedPhone);
        setIsLoginFlow(false);
      } else if (storedEmail) {
        setEmailOrPhone(storedEmail);
        setIsLoginFlow(true);
      } else {
        navigate("/login");
      }
    }
  }, [location, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (otp.length !== totalSlots) {
      alert("Please enter the complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isLoginFlow) {
        result = await verifyLoginOtp(emailOrPhone, otp);
      } else {
        result = await verifyOtp(emailOrPhone, otp);
      }

      localStorage.removeItem("otpPhoneNumber");
      localStorage.removeItem("otpEmailOrPhone");

      console.log(" OTP verified successfully:", result.redirectTo);
      navigate(result.redirectTo);
    } catch (error: any) {
      console.error(" OTP verification failed:", error);
      alert(error.message || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await resendOtp(emailOrPhone);
      setTimer(30);
      setOtp("");
      alert("OTP resent successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleChangeNumberOrEmail = () => {
    localStorage.removeItem("otpPhoneNumber");
    localStorage.removeItem("otpEmailOrPhone");
    navigate(isLoginFlow ? "/login" : "/signup");
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
              { emailOrPhone}
            </span>
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
              <span>Issue with OTP? </span>
              <span
                className="font-semibold underline cursor-pointer"
                onClick={handleChangeNumberOrEmail}
              >
                Change {isLoginFlow ? "email/phone" : "number"}
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

            {timer === 0 && (
              <div className="text-center text-sm mt-2">
                Didn’t receive the OTP?{" "}
                <span
                  className="underline font-semibold cursor-pointer"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
