// components/Login.tsx - 
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
      
      localStorage.setItem('loginEmailOrPhone', formData.emailOrPhone);
      localStorage.setItem('isAdminLogin', result.isAdmin.toString());
      
      console.log(` OTP sent to ${formData.emailOrPhone}, isAdmin: ${result.isAdmin}`);
      
      navigate('/verify-login-otp', { 
        state: { 
          emailOrPhone: formData.emailOrPhone,
          isAdmin: result.isAdmin 
        } 
      });
    } catch (error: any) {
      console.error(' OTP request failed:', error);
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
                    <Label htmlFor="emailOrPhone">Email/Phone</Label>
                    <Input
                      id="emailOrPhone"
                      name="emailOrPhone"
                      type="text"
                      placeholder="Enter Email or Phone Number"
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
              <span className="px-2 text-secondary text-xs font-semibold">OR</span>
              <Separator className="flex-1" />
            </div>

             <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              
              
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_225_2244)">
    <path d="M12 9.81812V14.4654H18.4582C18.1746 15.9599 17.3236 17.2254 16.0472 18.0763L19.9417 21.0982C22.2108 19.0037 23.5199 15.9273 23.5199 12.2728C23.5199 11.4219 23.4436 10.6036 23.3017 9.81825L12 9.81812Z" fill="black"/>
    <path d="M5.27461 14.2839L4.39625 14.9563L1.28711 17.3781C3.26165 21.2944 7.30862 23.9999 11.9995 23.9999C15.2394 23.9999 17.9557 22.9308 19.9412 21.0981L16.0467 18.0763C14.9776 18.7963 13.614 19.2327 11.9995 19.2327C8.87951 19.2327 6.22868 17.1273 5.27952 14.2909L5.27461 14.2839Z" fill="black"/>
    <path d="M1.28718 6.62207C0.469042 8.23655 0 10.0584 0 12.0002C0 13.942 0.469042 15.7638 1.28718 17.3783C1.28718 17.3891 5.27997 14.2801 5.27997 14.2801C5.03998 13.5601 4.89812 12.7965 4.89812 12.0001C4.89812 11.2036 5.03998 10.44 5.27997 9.72L1.28718 6.62207Z" fill="black"/>
    <path d="M11.9997 4.77818C13.767 4.77818 15.3379 5.38907 16.5925 6.56727L20.0288 3.13095C17.9452 1.18917 15.2398 0 11.9997 0C7.30887 0 3.26165 2.69454 1.28711 6.62183L5.27978 9.72001C6.22882 6.88362 8.87976 4.77818 11.9997 4.77818Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0_225_2244">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
</svg> <span>Continue with Google</span>
            </Button>

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