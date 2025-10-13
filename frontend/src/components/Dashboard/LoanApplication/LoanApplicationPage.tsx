import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoanDetailsForm } from "./LoanDetailsForm";
import { ReviewSubmit } from "./ReviewSubmit";

export function LoanApplicationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanAmount: "",
    repaymentTerm: "",
    purpose: "",
    interestRate: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* Sidebar */}
      <div className="w-56">
        {/* Sidebar imported globally */}
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-56 px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Apply for a loan</h1>
            <p className="text-gray-500">
              Tell us what you need. We’ll review your application quickly.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step === 1
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                1
              </div>
              <p className="text-sm mt-2 font-medium text-gray-700">Step 1</p>
              <span className="text-xs text-gray-400">Loan Details</span>
            </div>

            <div className="w-12 h-[2px] bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step === 2
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                2
              </div>
              <p className="text-sm mt-2 font-medium text-gray-700">Step 2</p>
              <span className="text-xs text-gray-400">Review & Submit</span>
            </div>
          </div>
        </div>

        {/* Card Section */}
        <Card className="w-full max-w-4xl mx-auto shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {step === 1 ? "Loan Details" : "Review & Submit"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <LoanDetailsForm
                formData={formData}
                onChange={handleInputChange}
                onNext={handleNext}
              />
            ) : (
              <ReviewSubmit formData={formData} onBack={handleBack} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
