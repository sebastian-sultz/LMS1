import React from "react";
import { Button } from "../ui/button";

interface TotalLoanProps {
  totalLoan?: string;
  onApplyClick?: () => void;
}

export const TotalLoan: React.FC<TotalLoanProps> = ({ totalLoan = "₹0", onApplyClick }) => {
  return (
    <div className="relative w-xl h-[185px] rounded-lg overflow-hidden text-center font-roobert bg-gradient-to-r from-[#fdffc2] via-[#feffdc] to-[#ffffff]">
      <div className="absolute top-1/2 left-1/2 w-[326px] flex flex-col items-center gap-3 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-full text-xs opacity-70 ">Total Loan Approved</div>
            <p className="w-full font-bold text-[28px] opacity-60">{totalLoan}</p>
          </div>
        </div>
        <Button onClick={onApplyClick} className="w-full">
          Apply for a Loan
        </Button>
      </div>
    </div>
  );
};