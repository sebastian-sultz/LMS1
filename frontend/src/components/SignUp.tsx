import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import indiaFlag from "@/assets/code.png";
import { Link } from "react-router";

export function SignUp() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center ">
        <div className=" text-center font-inter text-[20px] font-semibold leading-[22px] tracking-[0.25px] pb-4">
          SIGN UP
        </div>

        <Card className="w-full max-w-sm bg-white border-none">
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="relative">
                    <Label htmlFor="name">Phone</Label>

                    <div className="flex absolute top-5 left-3 size-5 items-center ">
                      <img src={indiaFlag} alt="" className="w-5 h-5" />
                      <span className="mt-[-2px] pl-1 text-[#858699] text-base">
                        +91
                      </span>
                    </div>

                    <Input
                      id="name"
                      type="tel"
                      placeholder="1234567890"
                      className="pl-17"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="name">Referral Code (Optional)</Label>

                    <Input
                      id="rfcode"
                      type="name"
                      placeholder="ENTER YOUR CODE "
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 ">
            <div className="text-secondary text-center text-xs justify-start">
              By clicking continue , you agree to our{" "}
              <span className="font-bold underline">Terms & Conditions </span>
              and <span className="font-bold underline ">Privacy Policy </span>
            </div>

            <Button variant="default" size="lg" className="w-full">
              Continue
            </Button>

            <div className=" text-sm text-center">
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
