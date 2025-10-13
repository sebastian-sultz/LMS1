import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoanDetailsFormProps {
  formData: {
    loanAmount: string;
    repaymentTerm: string;
    purpose: string;
    interestRate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export function LoanDetailsForm({ formData, onChange, onNext }: LoanDetailsFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Loan Amount */}
        <div>
          <Label htmlFor="loanAmount">Loan Amount</Label>
          <Input
            id="loanAmount"
            name="loanAmount"
            placeholder="Enter Amount"
            value={formData.loanAmount}
            onChange={onChange}
            required
          />
        </div>

        {/* Repayment Term */}
        <div>
          <Label htmlFor="repaymentTerm">Repayment Term</Label>
          <Select
            value={formData.repaymentTerm}
            onValueChange={(val) => (onChange({ target: { name: "repaymentTerm", value: val } } as any))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Repayment Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6 months">6 months</SelectItem>
              <SelectItem value="12 months">12 months</SelectItem>
              <SelectItem value="24 months">24 months</SelectItem>
              <SelectItem value="36 months">36 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <Label htmlFor="purpose">Purpose</Label>
        <Input
          id="purpose"
          name="purpose"
          placeholder="Your Purpose for Loan"
          value={formData.purpose}
          onChange={onChange}
          required
        />
      </div>

      {/* Interest Rate */}
      <div>
        <Label htmlFor="interestRate">Interest Rate</Label>
        <Input
          id="interestRate"
          name="interestRate"
          placeholder="Enter Interest Rate"
          value={formData.interestRate}
          onChange={onChange}
          required
        />
      </div>

      {/* Next Button */}
      <div>
        <Button type="submit" className="bg-black text-white px-6 rounded-full">
          Next
        </Button>
      </div>
    </form>
  );
}
