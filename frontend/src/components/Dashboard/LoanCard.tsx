import { Card, CardContent } from "@/components/ui/card";

interface LoanCardProps {
  amount: string;
  bank: string;
}

export function LoanCard({ amount, bank }: LoanCardProps) {
  return (
    <Card className="w-[293px] h-[94px] font-roobert bg-white relative overflow-hidden shadow-none">
      <CardContent className="p-0">
        {/* Top Section */}
        <div className="absolute left-[12px] top-[16px] w-[260px] inline-flex justify-between items-center">
          <div className="flex flex-col gap-[3px]">
            <span className="text-secondary text-xs font-normal font-roobert">
              Loan Amount
            </span>
            <span className=" text-xl font-roobert">
              {amount}
            </span>
          </div>

          {/* Icon (Blue Gradient Lines) */}
          <div className="relative overflow-hidden">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="42" height="42" fill="white"/>
<g filter="url(#filter0_di_7_2062)">
<path d="M4.90039 16.1001V29.2601C4.90039 30.8701 6.23039 32.2001 7.91039 32.2001H34.1604C35.7704 32.2001 37.1704 30.8701 37.1704 29.1901V16.1001H4.90039ZM16.1004 26.8101C16.1004 27.8601 15.2604 28.7001 14.2104 28.7001H9.59039C8.54039 28.7001 7.70039 27.8601 7.70039 26.8101V24.9901C7.70039 23.9401 8.54039 23.1001 9.59039 23.1001H14.2104C15.2604 23.1001 16.1004 23.9401 16.1004 24.9901V26.8101ZM16.1004 21.7001H8.40039C7.98039 21.7001 7.70039 21.4201 7.70039 21.0001C7.70039 20.5801 7.98039 20.3001 8.40039 20.3001H16.1004C16.5204 20.3001 16.8004 20.5801 16.8004 21.0001C16.8004 21.4201 16.5204 21.7001 16.1004 21.7001ZM21.0004 18.9001H8.40039C7.98039 18.9001 7.70039 18.6201 7.70039 18.2001C7.70039 17.7801 7.98039 17.5001 8.40039 17.5001H21.0004C21.4204 17.5001 21.7004 17.7801 21.7004 18.2001C21.7004 18.6201 21.4204 18.9001 21.0004 18.9001Z" fill="url(#paint0_linear_7_2062)"/>
<path d="M37.1004 14.7V12.74C37.1004 11.13 35.7704 9.80005 34.1604 9.80005H7.91039C6.23039 9.80005 4.90039 11.13 4.90039 12.81V14.7H37.1004Z" fill="url(#paint1_linear_7_2062)"/>
</g>
<defs>
<filter id="filter0_di_7_2062" x="0.900391" y="9.80005" width="40.2695" height="30.4001" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.847059 0 0 0 0 0.890196 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_2062"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_2062" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.847168 0 0 0 0 0.89047 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_7_2062"/>
</filter>
<linearGradient id="paint0_linear_7_2062" x1="37" y1="15.5251" x2="13.557" y2="40.3757" gradientUnits="userSpaceOnUse">
<stop stop-color="#1E83FF"/>
<stop offset="1" stop-color="#B2D3FD"/>
</linearGradient>
<linearGradient id="paint1_linear_7_2062" x1="36.9304" y1="9.62504" x2="33.132" y2="22.8261" gradientUnits="userSpaceOnUse">
<stop stop-color="#1E83FF"/>
<stop offset="1" stop-color="#B2D3FD"/>
</linearGradient>
</defs>
</svg>
</div>
        </div>

        {/* Bottom Blue Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[28px] bg-[#1E83FF0D]" />

        {/* Issued By Section */}
        <div className="absolute left-[12px] bottom-[6px] w-[260px] inline-flex justify-between items-center">
          <span className="text-blue-500 text-xs font-normal font-roobert">
            Issued by:
          </span>
          <span className="text-stone-950 text-xs font-roobert">
            {bank}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
