import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { LoanCard } from "./LoanCard";
import { TotalLoan } from "./TotalLoan";
import QuickAccessCard from "./QuickAccessCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { apiService } from '@/services/api';

export default function Dashboard() {
  const { token, isLoading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalApproved, setTotalApproved] = useState("₹0");
  const [filteredStatus, setFilteredStatus] = useState<"approved" | "pending" | "rejected">("approved");

  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login');
    }
  }, [authLoading, token, navigate]);

  // Fetch loans - uses apiService.getMyLoans() or direct authRequest
  useEffect(() => {
    const fetchLoans = async () => {
      if (!token) return;
      try {
        setLoadingLoans(true);
        setError(null);
        // Use the method or direct: const response = await apiService.authRequest('/loan/my-loans');
        const response = await apiService.getMyLoans(); // Assuming added above
        const fetchedLoans = Array.isArray(response) ? response : []; // Direct array from Go
        setLoans(fetchedLoans);

        // Calculate total approved (safe for non-numbers)
        const approvedLoans = fetchedLoans.filter((loan: any) => loan.Status?.toLowerCase() === 'approved');
        const total = approvedLoans.reduce((sum: number, loan: any) => sum + (parseFloat(loan.Amount) || 0), 0);
        setTotalApproved(`₹${total.toLocaleString('en-IN')}`);
      } catch (err: any) {
        setError(err.message || 'Failed to load loans');
        console.error('Fetch loans error:', err);
      } finally {
        setLoadingLoans(false);
      }
    };

    if (token) fetchLoans();
  }, [token]);

  const normalizeStatus = (status: string) => status?.toLowerCase().trim();

  const filteredLoans = loans.filter((loan) => normalizeStatus(loan.Status) === filteredStatus);

  const countByStatus = (status: string) => loans.filter((loan) => normalizeStatus(loan.Status) === status).length;

  return (
    <div className="flex font-roobert">
      <Sidebar onLogout={logout} />

      <main className="ml-64 flex-1 min-h-screen p-6 sm:p-8 transition-all">
        <DashboardHeader user={user} />

        <div className="flex relative pt-10">
          <TotalLoan totalLoan={totalApproved} onApplyClick={() => navigate('/dashboard/apply-loan')} />
          <QuickAccessCard />
        </div>

        <section className="pt-3">
          <h2 className="text-lg font-semibold">My Loans</h2>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-between">
            <div className="flex gap-2 mt-3">
              <button 
                className={`text-xs px-3 py-1 rounded-full ${filteredStatus === 'approved' ? 'bg-[#000] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilteredStatus('approved')}>
                Approved ({countByStatus('approved')})
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-full ${filteredStatus === 'pending' ? 'bg-[#000] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilteredStatus('pending')}>
                Pending ({countByStatus('pending')})
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-full ${filteredStatus === 'rejected' ? 'bg-[#000] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilteredStatus('rejected')}>
                Rejected ({countByStatus('rejected')})
              </button>
            </div>

            <button className="flex gap-3 text-sm mt-3 text-[#001336] py-1 hover:underline">
              View all{" "}
              <div className="flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6.7172 5.35372L1.70533 0.366398C1.57119 0.236842 1.39154 0.165154 1.20506 0.166775C1.01857 0.168395 0.840189 0.243194 0.708322 0.375061C0.576455 0.506929 0.501656 0.685313 0.500036 0.871795C0.498415 1.05828 0.570103 1.23793 0.699658 1.37207L5.20869 5.85656L0.717138 10.3236C0.649209 10.3892 0.595026 10.4677 0.557751 10.5544C0.520476 10.6412 0.500856 10.7345 0.500036 10.829C0.499215 10.9234 0.517211 11.0171 0.552972 11.1045C0.588733 11.1919 0.641544 11.2713 0.708323 11.3381C0.775102 11.4048 0.854511 11.4577 0.941919 11.4934C1.02933 11.5292 1.12298 11.5472 1.21742 11.5463C1.31185 11.5455 1.40518 11.5259 1.49195 11.4886C1.57872 11.4514 1.6572 11.3972 1.72281 11.3292L6.7172 6.3594C6.85053 6.22603 6.92544 6.04515 6.92544 5.85656C6.92544 5.66797 6.85053 5.4871 6.7172 5.35372Z" fill="#0E0E0E" />
                </svg>
              </div>
            </button>
          </div>

          <ScrollArea className="mt-5 max-w-6xl scroll-smooth overflow-x-auto">
            {loadingLoans ? (
              <div className="text-center py-4 text-gray-500">Loading loans...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : filteredLoans.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No {filteredStatus} loans found.</div>
            ) : (
              <div className="flex gap-4 pb-4">
                {filteredLoans.map((loan) => (
                  <div key={loan.ID || loan.id} className="min-w-[293px]"> {/* Fallback key */}
                    <LoanCard 
                      amount={`₹${(parseFloat(loan.Amount) || 0).toLocaleString('en-IN')}`} 
                      status={loan.Status || 'pending'}
                      rejectionReason={loan.RejectionReason || ''}
                    />
                  </div>
                ))}
              </div>
            )}
            <ScrollBar className="w-full"/>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
}