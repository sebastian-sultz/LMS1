import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { LoanCard } from "./LoanCard";
import { TotalLoan } from "./TotalLoan";
import QuickAccessCard from "./QuickAccessCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function Dashboard() {
  const { token, isLoading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login');
    }
  }, [authLoading, token, navigate]);

  // Example loans
  const loans = [
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
    { amount: "₹10,333", bank: "IDFC First Bank" },
  ];

  return (
    <div className="flex font-roobert">
      <Sidebar onLogout={logout} />

      <main className="ml-64 flex-1 min-h-screen p-6 sm:p-8 transition-all">
        <DashboardHeader user={user} />

        <div className="flex relative pt-10">
          {" "}
          <TotalLoan />
          <QuickAccessCard />
        </div>

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

            <button className="flex gap-3 text-sm mt-3 text-[#001336] py-1 hover:underline">
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

          <ScrollArea className=" mt-5 max-w-6xl scroll-smooth overflow-x-auto" >
            <div className="flex gap-4 pb-4">
              {loans.map((loan, i) => (
                <div key={i} className="min-w-[293px]">
                  <LoanCard amount={loan.amount} bank={loan.bank} />
                </div>
              ))}
            </div>
           <ScrollBar className="w-full"/>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
}




