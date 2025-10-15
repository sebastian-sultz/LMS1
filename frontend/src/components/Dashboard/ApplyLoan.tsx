// Updated ApplyLoan.tsx - Fixed payload keys to match Go struct
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
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import LoanCalculatorComponent from "./LoanCalculatorComponent";
import { apiService } from '@/services/api'; 
import { toast } from 'sonner';

export default function ApplyLoan() {
  const { token, isLoading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
    }
  }, [authLoading, token, navigate]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanAmount: '',
    repaymentTerm: '',
    loanType: ''
  });
  const [emi, setEmi] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateEMI = () => {
    const amount = parseFloat(formData.loanAmount);
    const term = parseInt(formData.repaymentTerm);
    if (!amount || !term) return;
    const rates: Record<string, number> = { home: 8, car: 9, gold: 7 };
    const rate = rates[formData.loanType] || 8;
    const monthlyRate = rate / 12 / 100;
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    setEmi(Math.round(emi));
  };

  const handleSubmit = async () => {
    if (!formData.loanAmount || !formData.repaymentTerm || !formData.loanType) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      // Fixed: Use keys matching Go struct json tags: amount, term, type
      await apiService.applyLoan({
        amount: parseFloat(formData.loanAmount),
        term: parseInt(formData.repaymentTerm),
        type: formData.loanType
      });
      toast.success('Loan applied successfully!');
      navigate('/dashboard?status=pending');
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply');
    }
  };

  const goToStep2 = (e: React.MouseEvent) => {
    e.preventDefault();
    calculateEMI();
    setStep(2);
  };

  return (
    <div className="flex font-roobert">
      <Sidebar onLogout={logout} />

      <main className="ml-64 flex-1 min-h-screen p-6 sm:p-8 transition-all">
        <DashboardHeader user={user} />

        <div className="relative pt-10">
          <div className="w-1/3">
            <div className="flex items-center">
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
            <div className="flex justify-between mt-2">
              <div className="text-left">
                <p className="text-sm font-medium">Step 1</p>
                <p className="text-xs text-gray-600">Loan Details</p>
              </div>
              <div className="text-right">
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
                        value={formData.loanAmount}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="relative flex-1">
                      <Label htmlFor="repaymentTerm">Repayment Term</Label>
                      <Select onValueChange={handleSelectChange('repaymentTerm')} value={formData.repaymentTerm}>
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
                    <Select onValueChange={handleSelectChange('loanType')} value={formData.loanType}>
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
                  <Button
                    type="button"
                    className="w-52"
                    onClick={goToStep2}
                  >
                    Save
                  </Button>
                </form>
              </>
            ) : (
              <>
                <LoanCalculatorComponent 
                  amount={formData.loanAmount} 
                  term={formData.repaymentTerm} 
                  type={formData.loanType} 
                  emi={emi} 
                />

                <div className="flex justify-between py-6">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="w-52"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="w-52"
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}