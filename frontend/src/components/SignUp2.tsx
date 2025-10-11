import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SignUp2() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center ">
        <div
           className="text-center font-inter text-[20px] font-bold leading-normal tracking-[-0.4px] pb-4">
            SIGN UP
          
        </div> 


<div className="flex items-center justify-center gap-2.5 px-4 py-2 rounded-[50px] bg-[#F2F3EE] ">
 <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 15C12.366 15 15.5 11.866 15.5 8C15.5 4.13401 12.366 1 8.5 1C4.63401 1 1.5 4.13401 1.5 8C1.5 11.866 4.63401 15 8.5 15ZM7.52625 4.52497C7.51197 4.23938 7.73968 4 8.02562 4H8.97438C9.26032 4 9.48803 4.23938 9.47375 4.52497L9.27375 8.52497C9.26045 8.79107 9.04081 9 8.77438 9H8.22562C7.95919 9 7.73955 8.79107 7.72625 8.52497L7.52625 4.52497ZM7.5 11C7.5 10.4477 7.94772 10 8.5 10C9.05228 10 9.5 10.4477 9.5 11C9.5 11.5523 9.05228 12 8.5 12C7.94772 12 7.5 11.5523 7.5 11Z" fill="#5F605B"/>
</svg>
  <p className="text-[#5F605B] text-sm">
    Enter your name as it appears on PAN Card
  </p>
</div>



        <Card className="w-full max-w-sm border-none">
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
                      First Name{" "}
                    </Label>
                    <Input
                      id="name"
                      type="name"
                      placeholder="Name"
                      className=""
                      required
                    />
                  </div>
                  <div className="relative">
                    <Label
                      htmlFor="name"
                      className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary"
                    >
                      {" "}
                      Last Name{" "}
                    </Label>
                    <Input
                      id="name"
                      type="name"
                      placeholder="Name"
                      className=""
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col ">
            <div className="flex items-center justify-center gap-2 pb-4">
              <Checkbox id="terms" />
             <div className="w-80 text-center justify-start"><span class="text-slate-500 text-xs font-normal font-['Inter'] leading-none">By clicking continue , you agree to our </span><span class="text-slate-500 text-xs font-bold font-['Inter'] underline leading-none">Terms & Conditions </span><span class="text-slate-500 text-xs font-normal font-['Inter'] leading-none">and </span><span class="text-slate-500 text-xs font-bold font-['Inter'] underline leading-none">Privacy Policy </span></div>
            </div>

            <Button variant="default" size="lg" className="w-full rounded-full">
              Continue
            </Button>

            <p className=" text-center text-[18px] font-medium leading-normal tracking-[-0.54px] pt-11 pb-2.5">
              Are you an Enterprise?
            </p>
            <Button variant="outline" size="lg" className="w-full rounded-full">
              Sign-Up as Enterprise
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
