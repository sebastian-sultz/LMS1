import React from "react";

interface TotalLoanProps {
  totalLoan?: string;
  onApplyClick?: () => void;
  bgImage?: string;
}

export const TotalLoan: React.FC<TotalLoanProps> = ({
  totalLoan = "₹10,00,000",
  onApplyClick,
  bgImage,
}) => {
  return (
   <div className="relative w-xl h-[185px]  rounded-lg overflow-hidden text-center font-roobert text-xs
                bg-gradient-to-r from-[#fdffc2] via-[#feffdc] to-[#ffffff]">
  
      <div className="absolute top-1/2 left-1/2 w-[326px] flex flex-col items-center gap-3 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-full opacity-50">{`Total Loan Approved`}</div>
            <b className="w-full text-[28px] opacity-50">{totalLoan}</b>
          </div>
        </div>
        <button
          onClick={onApplyClick}
          className="w-full bg-[#0e0e0e] text-white text-[16px] font-semibold rounded-[70px] py-3 px-8 flex justify-center items-center"
        >
          Apply for a Loan
        </button>
      </div>
    </div>
  );
};
