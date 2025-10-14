// Updated LoanCalculatorComponent.tsx - Dynamic props
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface LoanCalculatorProps {
  amount?: string;
  term?: string;
  type?: string;
  emi?: number;
}

function LoanCalculatorComponent({ amount = "0", term = "0", type = "N/A", emi = 0 }: LoanCalculatorProps) {
  const typeDisplay = type === 'home' ? 'Home' : type === 'car' ? 'Car' : type === 'gold' ? 'Gold' : 'N/A';
  const rate = type === 'home' ? 8 : type === 'car' ? 9 : type === 'gold' ? 7 : 0;

  return (
    <>
      <Card className="w-full font-roobert bg-white border-1 border-[#EAEAEA] relative overflow-hidden shadow-none p-0">
        <CardContent className="py-3.5 ">
          {/* Top Section */}
          <div className="flex justify-between items-center px-6 pb-3 ">
            <div className="text-center">
              <p className="text-lg font-semibold text-black">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
              <p className="text-sm  text-secondary">Loan Amount</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-black">{term}</p>
              <p className="text-sm  text-secondary">Repayment Term</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-black">{typeDisplay}</p>
              <p className="text-sm  text-secondary">Purpose</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-black">{rate}%</p>
              <p className="text-sm  text-secondary">Interest Rate</p>
            </div>
          </div>

          {/* Bottom Blue Bar */}
         <CardFooter className="pt-3.5">
           <div className="absolute bottom-0 left-0 w-full h-[27px] bg-[#1E83FF0D]" />

          {/* Issued By Section */}
          <div className="absolute left-[30px] bottom-[6px] w-[calc(100%-60px)] flex justify-between items-center">
            <span className="text-blue-500 text-xs font-normal font-roobert">
    Estimated Monthly Payment:
            </span>
            <span className="text-stone-950 text-xs font-semibold font-roobert">
             ₹{emi.toLocaleString('en-IN')}
            </span>
          </div>
         </CardFooter>
        </CardContent>
      </Card>
    </>
  );
}
export default LoanCalculatorComponent;