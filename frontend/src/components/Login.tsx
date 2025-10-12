// components/Login.tsx - Updated to navigate to SOTP component
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function Login() {
  const { requestLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emailOrPhone) {
      alert("Please enter your email or phone number");
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestLoginOtp(formData.emailOrPhone);
      
      // Store the email/phone for OTP verification and navigate to SOTP component
      localStorage.setItem('loginEmailOrPhone', formData.emailOrPhone);
      localStorage.setItem('isAdminLogin', result.isAdmin.toString());
      
      console.log(`✅ OTP sent to ${formData.emailOrPhone}, isAdmin: ${result.isAdmin}`);
      
      // Navigate to SOTP component for OTP verification
      navigate('/verify-login-otp', { 
        state: { 
          emailOrPhone: formData.emailOrPhone,
          isAdmin: result.isAdmin 
        } 
      });
    } catch (error: any) {
      console.error('❌ OTP request failed:', error);
      alert(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="text-center font-inter text-[20px] font-semibold leading-[22px] tracking-[0.25px] pb-4">
          LOGIN
        </div>

        <Card className="w-full max-w-sm bg-white border-none">
          <CardContent>
            <form onSubmit={handleRequestOtp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="relative">
                    <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
                    <Input
                      id="emailOrPhone"
                      name="emailOrPhone"
                      type="text"
                      placeholder="Enter your Email or Phone Number"
                      required
                      value={formData.emailOrPhone}
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
              <span className="font-bold underline">Terms & Conditions </span>
              and <span className="font-bold underline">Privacy Policy </span>
            </div>

            <Button 
              variant="default" 
              size="lg" 
              className="w-full"
              onClick={handleRequestOtp}
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Continue"}
            </Button>

            <div className="flex items-center w-full py-2">
              <Separator className="flex-1" />
              <span className="px-2 text-secondary">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="text-sm text-center">
              <span>Don't have an account? </span>
              <Link to="/signup" className="font-semibold underline">
                Sign Up Instead
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}