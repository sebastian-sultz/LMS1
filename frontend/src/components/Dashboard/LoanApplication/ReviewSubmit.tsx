import { Button } from "@/components/ui/button";

interface ReviewSubmitProps {
  formData: {
    loanAmount: string;
    repaymentTerm: string;
    purpose: string;
    interestRate: string;
  };
  onBack: () => void;
}

export function ReviewSubmit({ formData, onBack }: ReviewSubmitProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Review Your Details</h2>
        <p className="text-gray-500 text-sm">Ensure everything looks correct before submitting.</p>
      </div>

      <div className="space-y-3">
        <div><strong>Loan Amount:</strong> ₹{formData.loanAmount}</div>
        <div><strong>Repayment Term:</strong> {formData.repaymentTerm}</div>
        <div><strong>Purpose:</strong> {formData.purpose}</div>
        <div><strong>Interest Rate:</strong> {formData.interestRate}%</div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button className="bg-black text-white px-6 rounded-full">Submit</Button>
      </div>
    </div>
  );
}
