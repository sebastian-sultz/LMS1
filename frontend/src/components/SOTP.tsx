import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const totalSlots = 6;

export function SOTP() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-sm flex flex-col items-center gap-6 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="  text-center text-xl font-bold font-inter leading-tight tracking-wider">
              VERIFY OTP
            </div>
            <div className="w-72 text-center text-base font-inter">
              <span className="  font-normal">
                We have sent an OTP to{" "}
              </span>
              <span className="  font-extrabold">8168864861</span>
            </div>
          </div>

          <div className="w-full">
            <form className="flex flex-col gap-8 w-full">
              <div className="flex flex-col items-center gap-6 self-stretch">
                <div className="w-full flex justify-center">
                  <InputOTP maxLength={totalSlots} className="flex gap-4">
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
                  <span className="  font-bold">28 seconds</span>
                </div>
              </div>

              <div className="self-stretch text-center text-sm font-inter mt-[-8px]">
                <span className="">Issue with OTP, </span>
                <span className="  font-semibold underline cursor-pointer">
                  Change registered Number{" "}
                </span>
              </div>

              <Button variant="default" size="lg" className="w-full">
                Verify OTP
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
