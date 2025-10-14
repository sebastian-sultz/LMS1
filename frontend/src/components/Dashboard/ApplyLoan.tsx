import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";

export default function ApplyLoan() {
  const { token, isLoading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
    }
  }, [authLoading, token, navigate]);

  const [step, setStep] = useState(1);

  return (
    <div className="flex font-roobert">
      <Sidebar onLogout={logout} />

      <main className="ml-64 flex-1 min-h-screen p-6 sm:p-8 transition-all">
        <DashboardHeader user={user} />

        <div className="relative pt-10">
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-1/3">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-black text-white">
                1
              </div>
              <div
                className={`flex-1 h-0.5 ${
                  step >= 2 ? "bg-black" : "bg-gray-200"
                } mx-4`}
              ></div>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  step >= 2
                    ? "bg-black text-white"
                    : "border border-black text-black bg-white"
                }`}
              >
                2
              </div>
            </div>
            <div className="flex justify-between w-1/3 mt-2">
              <div className="text-center">
                <p className="text-sm font-medium">Step 1</p>
                <p className="text-xs text-gray-600">Loan Details</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Step 2</p>
                <p className="text-xs text-gray-600">Review & Submit</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {step === 1 ? (
              <>
                <form className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <Input
                        id="loanAmount"
                        name="loanAmount"
                        type="text"
                        placeholder="Enter Amount"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Label htmlFor="repaymentTerm">Repayment Term</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Repayment Term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Terms</SelectLabel>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="18">18 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="30">30 Months</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <Label htmlFor="loanType">Loan Type</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Loan Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loan Type</SelectLabel>
                          <SelectItem value="home">Home Loan</SelectItem>
                          <SelectItem value="car">Car Loan</SelectItem>
                          <SelectItem value="gold">Gold Loan</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </form>

                  <Button type="submit" size="lg" className="w-full" onClick={() => setStep(2)}>
                    Save
                  </Button>
               
              </>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={() => alert("Submitted!")} // Placeholder for submit action
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}