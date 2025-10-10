import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function Login() {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <Card className="w-full max-w-sm border-none bg-white">
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <div className="relative">
                    <Label
                      htmlFor="email"
                         
                    >
                      {" "}
                      Email/Phone{" "}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <CardDescription className="text-secondary px-2">
                    By clicking continue , you agree to our{" "}
                    <Link to="/" className="underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="underline">
                      {" "}
                      Privacy Policy
                    </Link>
                  </CardDescription>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              variant="default"
              size="lg"
              className="w-full rounded-full"
            >
              Continue
            </Button>

            <div className="flex items-center w-full py-5">
              <Separator className="flex-1" />
              <span className="px-2 text-secondary  ">or</span>
              <Separator className="flex-1" />
            </div>

            <Button variant="outline" size="lg" className="w-full ">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_2583)">
                  <path
                    d="M12 9.81812V14.4654H18.4582C18.1746 15.9599 17.3236 17.2254 16.0472 18.0763L19.9417 21.0982C22.2108 19.0037 23.5199 15.9273 23.5199 12.2728C23.5199 11.4219 23.4436 10.6036 23.3017 9.81825L12 9.81812Z"
                    fill="black"
                  />
                  <path
                    d="M5.27461 14.2841L4.39625 14.9564L1.28711 17.3782C3.26165 21.2945 7.30862 24 11.9995 24C15.2394 24 17.9557 22.9309 19.9412 21.0983L16.0467 18.0764C14.9776 18.7964 13.614 19.2328 11.9995 19.2328C8.87951 19.2328 6.22868 17.1274 5.27952 14.291L5.27461 14.2841Z"
                    fill="black"
                  />
                  <path
                    d="M1.28718 6.62207C0.469042 8.23655 0 10.0584 0 12.0002C0 13.942 0.469042 15.7638 1.28718 17.3783C1.28718 17.3891 5.27997 14.2801 5.27997 14.2801C5.03998 13.5601 4.89812 12.7965 4.89812 12.0001C4.89812 11.2036 5.03998 10.44 5.27997 9.72L1.28718 6.62207Z"
                    fill="black"
                  />
                  <path
                    d="M11.9997 4.77818C13.767 4.77818 15.3379 5.38907 16.5925 6.56727L20.0288 3.13095C17.9452 1.18917 15.2398 0 11.9997 0C7.30887 0 3.26165 2.69454 1.28711 6.62183L5.27978 9.72001C6.22882 6.88362 8.87976 4.77818 11.9997 4.77818Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_2583">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
