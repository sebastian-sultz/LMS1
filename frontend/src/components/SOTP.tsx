// components/SOTP.tsx - COMPLETELY FIXED
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";

const totalSlots = 6;

export function SOTP() {
  const { verifyOtp, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (location.state?.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    } else {
      const storedPhone = localStorage.getItem('tempPhoneNumber');
      if (storedPhone) {
        setPhoneNumber(storedPhone);
      } else {
        navigate('/signup');
      }
    }
  }, [location, navigate]);

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
      const result = await verifyOtp(phoneNumber, otp);
      // Clear temporary phone number from storage
      localStorage.removeItem('tempPhoneNumber');
      
      console.log("✅ OTP verified, redirecting to:", result.redirectTo);
      navigate(result.redirectTo);
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      alert(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(phoneNumber);
      setTimer(30);
      setOtp("");
      alert("OTP resent successfully!");
    } catch (error: any) {
      alert(error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleChangeNumber = () => {
    localStorage.removeItem('tempPhoneNumber');
    navigate('/signup');
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-sm flex flex-col items-center gap-6 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="  text-center text-xl font-bold font-inter leading-tight tracking-wider">
              VERIFY OTP
            </div>
            <div className=" text-center text-base font-inter">
              <span className="  font-normal">
                We have sent an OTP to{" "}
              </span>
              <span className="  font-extrabold">+91 {phoneNumber}</span>
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
                          className="w-14 h-[60px] text-lg font-bold "
                        />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                </div>

                <div className="self-stretch text-center text-sm font-inter mt-[-8px]">
                  <span className="  ">Expect OTP in </span>
                  <span className="  font-bold">{timer} seconds</span>
                </div>
              </div>

              <div className="self-stretch text-center text-sm font-inter mt-[-8px]">
                <span className="">Issue with OTP, </span>
                <span 
                  className="  font-semibold underline cursor-pointer"
                  onClick={handleChangeNumber}
                >
                  Change registered Number{" "}
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
    </>
  );
}