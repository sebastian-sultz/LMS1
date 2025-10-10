import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { LoanCard } from "./LoanCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Wallet, Star } from "lucide-react";
import { TotalLoan } from "./TotalLoan";
import QuickAccessCard from "./QuickAccessCard";

export default function Dashboard() {
  // Example hardcoded data (replace later with API data)
  const totalLoan = "₹10,00,000";
  const outstandingBalance = "₹5,00,000";
  const repaymentDue = "₹40,000";
  const activeLoans = 6;
  const creditScore = 750;

  // Example loans
  const loans = [
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
  ];

  return (
    <div className="flex font-roobert">
      <Sidebar />

      <main className="ml-64 flex-1 min-h-screen p-6 sm:p-8 transition-all">
        <DashboardHeader />

        {/* Total Loan Card
        <Card className="mt-6 bg-gradient-to-r from-[#f9f9f5] to-[#eaeaea] border-none">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#858699]">Total Loan Approved</p>
              <h2 className="text-3xl font-semibold mt-1">{totalLoan}</h2>
            </div>
            <Button className="bg-black text-white rounded-full px-6 py-2 mt-4 sm:mt-0">
              Apply for a Loan
            </Button>
          </CardContent>
        </Card> */}
        <div className="flex relative pt-10">
          {" "}
          <TotalLoan />
          <QuickAccessCard />
        </div>

        {/* 
        Summary Cards
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <SummaryCard label="Outstanding Balance" value={outstandingBalance} icon={Wallet} />
          <SummaryCard label="Repayment Due" value={repaymentDue} icon={TrendingUp} />
          <SummaryCard label="Active Loans" value={activeLoans} icon={Star} />
          <SummaryCard label="Credit Score" value={creditScore} icon={Star} />
        </div> */}

        {/* Quick Access
        <Card className="mt-6">
          <CardContent className="flex items-center justify-around p-6">
            {[
              { label: "My Loans", icon: Wallet },
              { label: "Apply for a new loan", icon: PlusCircle },
              { label: "Repayments", icon: TrendingUp },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-[#f5f6f9] hover:bg-[#eaeaea] transition">
                  <item.icon className="h-5 w-5 text-[#001336]" />
                </div>
                <span className="text-sm font-medium text-[#001336]">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card> */}

        {/* My Loans Section */}
        <section className="pt-3">
          <h2 className="text-lg font-semibold">My Loans</h2>

          <div className="flex justify-between">
            <div className="flex gap-2 mt-3">
              <button className="bg-[#000] text-white text-xs px-3 py-1 rounded-full">
                Approved
              </button>
              <button className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                Pending
              </button>
              <button className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                Rejected
              </button>
            </div>

            <button className=" flex gap-3 text-sm mt-3 text-[#001336] py-1 hover:underline">
              View all{" "}
              <div className="flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                >
                  <path
                    d="M6.7172 5.35372L1.70533 0.366398C1.57119 0.236842 1.39154 0.165154 1.20506 0.166775C1.01857 0.168395 0.840189 0.243194 0.708322 0.375061C0.576455 0.506929 0.501656 0.685313 0.500036 0.871795C0.498415 1.05828 0.570103 1.23793 0.699658 1.37207L5.20869 5.85656L0.717138 10.3236C0.649209 10.3892 0.595026 10.4677 0.557751 10.5544C0.520476 10.6412 0.500856 10.7345 0.500036 10.829C0.499215 10.9234 0.517211 11.0171 0.552972 11.1045C0.588733 11.1919 0.641544 11.2713 0.708323 11.3381C0.775102 11.4048 0.854511 11.4577 0.941919 11.4934C1.02933 11.5292 1.12298 11.5472 1.21742 11.5463C1.31185 11.5455 1.40518 11.5259 1.49195 11.4886C1.57872 11.4514 1.6572 11.3972 1.72281 11.3292L6.7172 6.3594C6.85053 6.22603 6.92544 6.04515 6.92544 5.85656C6.92544 5.66797 6.85053 5.4871 6.7172 5.35372Z"
                    fill="#0E0E0E"
                  />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-5">
            {loans.map((loan, i) => (
              <LoanCard key={i} amount={loan.amount} bank={loan.bank} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// // 📦 Summary Card Component (inline helper)
// function SummaryCard({
//   label,
//   value,
//   icon: Icon,
// }: {
//   label: string
//   value: string | number
//   icon: any
// }) {
//   return (
//     <Card className="text-center hover:shadow-md transition cursor-pointer">
//       <CardContent className="p-4 flex flex-col items-center justify-center">
//         <Icon className="h-5 w-5 mb-1 text-[#858699]" />
//         <p className="text-sm text-[#858699]">{label}</p>
//         <h3 className="text-lg font-semibold text-[#001336] mt-1">{value}</h3>
//       </CardContent>
//     </Card>
//   )
// }
