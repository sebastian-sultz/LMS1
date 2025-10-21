import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import indiaFlag from "@/assets/code.png";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    referralCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(formData.phoneNumber, formData.referralCode);

      console.log("Signup result:", result);

      if (result.requiresOtp) {
        toast.success(`OTP sent to +91${formData.phoneNumber}`);
        console.log("New user - redirecting to OTP verification");
        localStorage.setItem("tempPhoneNumber", formData.phoneNumber);
        navigate("/verify-otp", {
          state: { phoneNumber: formData.phoneNumber },
        });
      } else {
        toast.info("Existing user detected, please log in");
        console.log("Existing user - redirecting to login");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="text-center font-inter text-[20px] font-semibold leading-[22px] tracking-[0.25px] pb-4">
          SIGN UP
        </div>

        <Card className="w-full max-w-sm bg-white border-none">
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="relative">
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <div className="flex absolute top-5 left-3 size-5 items-center">
                      <img src={indiaFlag} alt="" className="w-5 h-5" />
                      <span className="mt-[-2px] pl-1 text-[#858699] text-base">
                        +91
                      </span>
                    </div>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      maxLength={10}
                      placeholder="1234567890"
                      className="pl-17"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="referralCode">
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referralCode"
                      name="referralCode"
                      type="text"
                      placeholder="ENTER YOUR CODE"
                      value={formData.referralCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-secondary text-center text-xs justify-start">
              By clicking continue, you agree to our{" "}
              <span className="font-bold underline">Terms & Conditions</span>{" "}
              and <span className="font-bold underline">Privacy Policy</span>
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Continue"}
            </Button>
            <div className="text-sm text-center">
              <span>Already have an account, </span>
              <Link to="/login" className="font-semibold underline">
                Log-In Instead
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
