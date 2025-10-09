import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import indiaFlag from "@/assets/code.png";

export function SMobileNo() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center ">
        <div className="text-black text-center font-inter text-[20px] font-semibold leading-[22px] tracking-[0.25px] pb-4">
          SIGN UP
        </div>

        <Card className="w-full max-w-sm">
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="relative">
                    <Label
                      htmlFor="name"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary"
                    >
                      {" "}
                      Phone{" "}
                    </Label>

                    
                    <div className="flex absolute top-5 left-3 size-5 items-center ">
  <img src={indiaFlag} alt="" className="w-5 h-5" />
  <span className="mt-[-1px] pl-1 text-[#858699]">+91</span>
</div>
                      
                      
                      <Input
                        id="name"
                        type="tel"
                        placeholder="1234567890"
                        className="pl-17"
                        required
                      />
                   
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col ">
            <Button variant="default" size="lg" className="w-full rounded-full">
              Save & Send OTP
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
