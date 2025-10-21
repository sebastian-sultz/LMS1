import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoanDashboard from "./LoanDashboard";
import { Card, CardContent } from "../ui/card";
import { apiService } from "@/services/api";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { token, isLoading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [loans, setLoans] = useState<any[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filteredStatus, setFilteredStatus] = useState<
    "approved" | "pending" | "rejected"
  >("pending"); // Default to pending for admin

  useEffect(() => {
    if (!authLoading && !token) {
      toast.error("Please log in to access the dashboard");
      navigate("/login");
    }
  }, [authLoading, token, navigate]);

  useEffect(() => {
    if (user) {
      console.log("User updated in Dashboard:", user);
    }
  }, [user]);

  // Set initial status from query param (e.g., ?status=pending)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialStatus = params.get("status");
    if (
      initialStatus &&
      ["approved", "pending", "rejected"].includes(initialStatus)
    ) {
      setFilteredStatus(initialStatus as "approved" | "pending" | "rejected");
      toast.info(`Showing ${initialStatus} loans`);
    }
  }, [location.search]);

  // Fetch all loans on mount (admin only)
  useEffect(() => {
    const fetchLoans = async () => {
      if (!user?.isAdmin) return;
      try {
        setError(null);
        const data = await apiService.getAllLoans();
        setLoans(data);
        toast.success("Loans fetched successfully");
      } catch (err: any) {
        setError(err.message || "Failed to fetch loans");
        toast.error(err.message || "Failed to fetch loans");
        console.error("Fetch loans error:", err);
      }
    };

    fetchLoans();
  }, [user]);

  // Compute overdue count after loans load (only for approved loans)
  useEffect(() => {
    const computeOverdue = async () => {
      if (!loans.length || !user?.isAdmin) {
        setOverdueCount(0);
        return;
      }

      let count = 0;
      const approvedLoans = loans.filter((loan) => normalizeStatus(loan.Status) === "approved");

      for (const loan of approvedLoans) {
        try {
          const repayments = await apiService.getRepayments(loan.ID);
          const hasOverdue = repayments.some(
            (rep: any) => new Date(rep.DueDate) < new Date() && rep.Status === "pending"
          );
          if (hasOverdue) count++;
        } catch (err) {
          console.error(`Error fetching repayments for loan ${loan.ID}:`, err);
        }
      }

      setOverdueCount(count);
    };

    computeOverdue();
  }, [loans, user]);

  const normalizeStatus = (status: string) => status?.toLowerCase().trim();

  const countByStatus = (status: string) =>
    loans.filter((loan) => normalizeStatus(loan.Status) === status).length;

  const filteredLoans = loans.filter((loan) => normalizeStatus(loan.Status) === filteredStatus);

  const handleRefresh = async () => {
    try {
      const data = await apiService.getAllLoans();
      setLoans(data);
      setError(null);
      toast.success("Loans refreshed successfully");
    } catch (err: any) {
      setError(err.message || "Failed to refresh loans");
      toast.error(err.message || "Failed to refresh loans");
    }
  };

  if (!user?.isAdmin) {
    toast.error("Admin access required");
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex font-roobert">
      <Sidebar onLogout={logout} user={user} />

      <main className="ml-64 flex-1 min-h-screen p-6 sm:p-8 transition-all ">
        <DashboardHeader user={user} />

        <div className="flex gap-6 pb-6">
          <Card className="w-80 h-28 bg-sky-50 rounded-[10px] shadow-none border-none">
            <CardContent>
              <div className="w-full flex flex-col justify-start items-start gap-6">
                <div className="font-medium leading-none">Total Active Loans</div>
                <div className="w-full flex justify-between items-end">
                  <div className="text-2xl font-bold leading-normal">
                    {countByStatus("approved")}
                  </div>
                  <div className="w-6 h-6 relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-80 h-28 bg-sky-50 rounded-[10px] shadow-none border-none">
            <CardContent>
              <div className="w-full flex flex-col justify-start items-start gap-6">
                <div className="font-medium leading-none">Pending Applications</div>
                <div className="w-full flex justify-between items-end">
                  <div className="text-2xl font-bold leading-normal">
                    {countByStatus("pending")}
                  </div>
                  <div className="w-6 h-6 relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-80 h-28 bg-sky-50 rounded-[10px] shadow-none border-none">
            <CardContent>
              <div className="w-full flex flex-col justify-start items-start gap-6">
                <div className="font-medium leading-none">Overdue Loans</div>
                <div className="w-full flex justify-between items-end">
                  <div className="text-2xl font-bold leading-normal">
                    {overdueCount}
                  </div>
                  <div className="w-6 h-6 relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="py-3">
          <h2 className="text-lg font-semibold">Loan Applications</h2>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-between">
            <div className="flex gap-2 mt-3">
              <button
                className={`text-xs px-3 py-1 rounded-full ${
                  filteredStatus === "approved"
                    ? "bg-[#000] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setFilteredStatus("approved");
                  toast.info("Showing approved loans");
                }}
              >
                Approved ({countByStatus("approved")})
              </button>
              <button
                className={`text-xs px-3 py-1 rounded-full ${
                  filteredStatus === "pending"
                    ? "bg-[#000] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setFilteredStatus("pending");
                  toast.info("Showing pending loans");
                }}
              >
                Pending ({countByStatus("pending")})
              </button>
              <button
                className={`text-xs px-3 py-1 rounded-full ${
                  filteredStatus === "rejected"
                    ? "bg-[#000] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setFilteredStatus("rejected");
                  toast.info("Showing rejected loans");
                }}
              >
                Rejected ({countByStatus("rejected")})
              </button>
            </div>

            <button className="flex gap-3 text-sm mt-3 text-[#001336] py-1 hover:underline" onClick={handleRefresh}>
              Refresh{" "}
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
        </section>

        <LoanDashboard
          loans={filteredLoans}
          onRefresh={handleRefresh}
          onError={(err) => {
            setError(err);
            toast.error(err);
          }}
        />
      </main>
    </div>
  );
}