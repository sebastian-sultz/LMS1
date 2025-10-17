import { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface Repayment {
  ID: string;
  LoanID: string;
  DueDate: string;
  Amount: number;
  Status: string;
}

interface Loan {
  ID: string;
  UserID: string;
  BorrowerName: string;
  Amount: number;
  TermMonths: number;
  LoanType: string;
  Status: string;
  ApplicationDate?: string;
  ApprovalDate?: string;
  RejectionReason?: string | null;
  repayments?: Repayment[];
}

const RepaymentDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { token } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && token) fetchLoansAndRepayments();
  }, [open, token]);

  const fetchLoansAndRepayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetched = await apiService.getMyLoans();
      const loansArray: Loan[] = Array.isArray(fetched) ? fetched : [];

      const approved = loansArray.filter(
        (l) => (l.Status || "").toString().toLowerCase() === "approved"
      );

      const withRepayments = await Promise.all(
        approved.map(async (loan) => {
          try {
            const reps = await apiService.getRepayments(loan.ID);
            const normalized: Repayment[] = reps.map((r: any) => ({
              ID: r.ID || r.id,
              LoanID: r.LoanID || r.loanID || r.loanId,
              DueDate: r.DueDate || r.dueDate || r.due_date,
              Amount: Number(r.Amount || r.amount || 0),
              Status: r.Status || r.status || "",
            }));
            normalized.sort(
              (a, b) => new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime()
            );
            return { ...loan, repayments: normalized };
          } catch (err) {
            console.error("Failed to load repayments for loan", loan.ID, err);
            return { ...loan, repayments: [] as Repayment[] };
          }
        })
      );

      setLoans(withRepayments);
    } catch (err: any) {
      console.error("Failed to fetch loans:", err);
      setError(err.message || "Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB");
  };

  const daysLeftLabel = (dueDate?: string) => {
    if (!dueDate) return "";
    const diff = Math.ceil(
      (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 1) return `${diff} DAYS LEFT`;
    if (diff === 1) return `1 DAY LEFT`;
    if (diff === 0) return `DUE TODAY`;
    return `DUE`;
  };

  const Separator = () => (
    <div className="flex justify-center w-full mt-[14px] mb-[0px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="45" viewBox="0 0 6 45" fill="none">
        <path
          d="M2.66602 8.13007e-05C1.19326 8.12364e-05 -0.000651057 1.19399 -0.000651121 2.66675C-0.000651186 4.13951 1.19326 5.33341 2.66602 5.33341C4.13877 5.33341 5.33268 4.13951 5.33268 2.66675C5.33268 1.19399 4.13878 8.13651e-05 2.66602 8.13007e-05ZM2.66601 39.0001C1.19325 39.0001 -0.000652762 40.194 -0.000652826 41.6667C-0.00065289 43.1395 1.19325 44.3334 2.66601 44.3334C4.13877 44.3334 5.33268 43.1395 5.33268 41.6667C5.33268 40.194 4.13877 39.0001 2.66601 39.0001ZM2.66602 2.66675L2.16602 2.66675L2.16602 3.64175L2.66602 3.64175L3.16602 3.64175L3.16602 2.66675L2.66602 2.66675ZM2.66602 5.59175L2.16602 5.59175L2.16602 7.54175L2.66602 7.54175L3.16602 7.54175L3.16602 5.59175L2.66602 5.59175ZM2.66602 9.49175L2.16602 9.49175L2.16602 11.4417L2.66602 11.4417L3.16602 11.4417L3.16602 9.49175L2.66602 9.49175ZM2.66602 13.3917L2.16602 13.3917L2.16602 15.3417L2.66602 15.3417L3.16602 15.3417L3.16602 13.3917L2.66602 13.3917ZM2.66601 17.2917L2.16601 17.2917L2.16601 19.2417L2.66601 19.2417L3.16601 19.2417L3.16601 17.2917L2.66601 17.2917ZM2.66601 21.1917L2.16601 21.1917L2.16601 23.1418L2.66601 23.1418L3.16601 23.1418L3.16601 21.1917L2.66601 21.1917ZM2.66601 25.0917L2.16601 25.0917L2.16601 27.0417L2.66601 27.0417L3.16601 27.0417L3.16601 25.0917L2.66601 25.0917ZM2.66601 28.9918L2.16601 28.9918L2.16601 30.9418L2.66601 30.9418L3.16601 30.9418L3.16601 28.9918L2.66601 28.9918ZM2.66601 32.8918L2.16601 32.8918L2.16601 34.8418L2.66601 34.8418L3.16601 34.8418L3.16601 32.8918L2.66601 32.8918ZM2.66601 36.7918L2.16601 36.7918L2.16601 38.7418L2.66601 38.7418L3.16601 38.7418L3.16601 36.7918L2.66601 36.7918ZM2.66601 40.6918L2.16601 40.6918L2.16601 41.6667L2.66601 41.6667L3.16601 41.6667L3.16601 40.6918L2.66601 40.6918Z"
          fill="#858699"
        />
      </svg>
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="font-roobert h-full bg-white outline outline-gray-200 p-0 flex flex-col overflow-x-hidden overflow-y-auto min-w-[501px]">
        <div className="flex-grow overflow-y-auto w-full">
          <div className="min-h-full border border-[#eaeaea] w-full">
            {/* Header */}
            <div className="px-4 pt-6 pb-4 flex justify-between items-center h-[24px] relative z-[101]">
              <div className="text-[24px] font-medium text-[#000]">Repayment Schedule</div>
              <button
                onClick={onClose}
                className="w-[28px] h-[28px] bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Data States */}
            {loading ? (
              <div className="flex justify-center py-8 text-gray-500 text-sm">
                Loading repayments...
              </div>
            ) : error ? (
              <div className="flex justify-center py-8 text-red-500 text-sm">{error}</div>
            ) : loans.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-gray-400 text-sm">
                <span>No approved loans found.</span>
              </div>
            ) : (
              loans.map((loan, idx) => (
                <div key={loan.ID} className="relative" style={{ zIndex: 50 - idx }}>
                {loan.repayments && loan.repayments.length > 0 ? (
  <>
    {/* Highlighted (first) repayment */}
    <div className="flex justify-center">
      <div>
        {/* Badge */}
        <div className="flex w-[70px] h-[23px] justify-center items-center bg-[#ff3e3e] rounded-[5px] mt-[26px] ml-[28px]">
          <span className="text-[8px] font-semibold text-white tracking-[0.72px]">
            {daysLeftLabel(loan.repayments[0].DueDate)}
          </span>
        </div>

        {/* Highlighted card */}
        <div
          className="w-[468px] h-[93px] bg-white rounded-[10px] relative overflow-hidden mt-[-4px] ml-[16px]"
          style={{ borderWidth: 0.5, borderColor: "#ff3e3e" }}
        >
          <div className="flex justify-between items-center mt-[12px] ml-[12px] w-[444px]">
            <span className="text-[14px] font-medium text-[#000]">
              { loan.LoanType || "Loan"}
            </span>
            <div className="flex items-center gap-[8px] px-[8px] py-[4px] rounded-full">
              <span className="text-[12px] font-semibold text-[#0e0e0e]">
                Repay Now
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
  <path d="M5.32903 4.44598L1.03314 0.171128C0.918166 0.0600806 0.764174 -0.00136593 0.604333 2.30454e-05C0.444492 0.00141202 0.291591 0.0655253 0.178562 0.178554C0.0655328 0.291583 0.00141949 0.444485 3.05176e-05 0.604326C-0.00135846 0.764167 0.0600881 0.918159 0.171136 1.03313L4.03602 4.87698L0.186119 8.70585C0.127893 8.76208 0.0814506 8.82935 0.0495009 8.90373C0.0175511 8.97811 0.00073391 9.0581 3.05176e-05 9.13905C-0.000672875 9.21999 0.0147521 9.30027 0.0454044 9.37519C0.0760568 9.45011 0.121323 9.51817 0.178562 9.57541C0.235802 9.63265 0.303867 9.67792 0.378787 9.70857C0.453708 9.73922 0.533982 9.75465 0.614928 9.75394C0.695873 9.75324 0.775868 9.73642 0.850244 9.70447C0.924621 9.67252 0.991889 9.62608 1.04813 9.56786L5.32903 5.30799C5.44332 5.19367 5.50752 5.03863 5.50752 4.87698C5.50752 4.71533 5.44332 4.5603 5.32903 4.44598Z" fill="#0E0E0E"/>
</svg>
            </div>
          </div>
          <div className="w-[468px] h-[45px] bg-[#f9f9f9] mt-[12px]">
            <div className="flex justify-between items-center mt-[8px] ml-[12px] w-[444px]">
              <div className="flex flex-col gap-[2px] w-[70px] text-left">
                <span className="text-[13px] font-medium text-[#000]">
                  ₹{loan.repayments[0].Amount.toLocaleString("en-IN")}
                </span>
                <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                  TOTAL AMOUNT
                </span>
              </div>
              <div className="flex flex-col gap-[2px] w-[70px] text-center">
                <span className="text-[13px] font-medium text-[#000]">
                  {loan.TermMonths}M
                </span>
                <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                  TERM
                </span>
              </div>
              <div className="flex flex-col gap-[2px] w-[70px] text-right">
                <span className="text-[13px] font-medium text-[#2a9266]">
                  {loan.repayments.filter((r) => r.Status === "paid").length} /{" "}
                  {loan.repayments.length}
                </span>
                <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                  REPAID
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <Separator />

    {/* Other repayments */}
    {loan.repayments.slice(1).map((r, index, arr) => (
      <div key={r.ID}>
    
        <div className="flex justify-center">
          <div>
            <div className="flex w-[70px] h-[23px] justify-center items-center bg-[#0e0e0e] rounded-[5px] mt-[18.333px] ml-[28px]">
              <span className="text-[8px] font-semibold text-white tracking-[0.72px]">
                {formatDate(r.DueDate)}
              </span>
            </div>

            <div className="w-[468px] h-[93px] bg-white rounded-[10px] border border-[#eaeaea] mt-[-4px] ml-[16px] relative overflow-hidden">
              <div className="flex justify-between items-center mt-[12px] ml-[12px] w-[444px]">
                <span className="text-[14px] font-medium text-[#000]">
                  {loan.LoanType || "Loan"}
                </span>
                <div className="flex items-center gap-[8px] px-[8px] py-[4px] rounded-full">
                  <span className="text-[12px] font-semibold text-[#0e0e0e]">
                    Repay Now
                  </span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
  <path d="M5.32903 4.44598L1.03314 0.171128C0.918166 0.0600806 0.764174 -0.00136593 0.604333 2.30454e-05C0.444492 0.00141202 0.291591 0.0655253 0.178562 0.178554C0.0655328 0.291583 0.00141949 0.444485 3.05176e-05 0.604326C-0.00135846 0.764167 0.0600881 0.918159 0.171136 1.03313L4.03602 4.87698L0.186119 8.70585C0.127893 8.76208 0.0814506 8.82935 0.0495009 8.90373C0.0175511 8.97811 0.00073391 9.0581 3.05176e-05 9.13905C-0.000672875 9.21999 0.0147521 9.30027 0.0454044 9.37519C0.0760568 9.45011 0.121323 9.51817 0.178562 9.57541C0.235802 9.63265 0.303867 9.67792 0.378787 9.70857C0.453708 9.73922 0.533982 9.75465 0.614928 9.75394C0.695873 9.75324 0.775868 9.73642 0.850244 9.70447C0.924621 9.67252 0.991889 9.62608 1.04813 9.56786L5.32903 5.30799C5.44332 5.19367 5.50752 5.03863 5.50752 4.87698C5.50752 4.71533 5.44332 4.5603 5.32903 4.44598Z" fill="#0E0E0E"/>
</svg>
                </div>
              </div>
              <div className="w-[468px] h-[45px] bg-[#f9f9f9] mt-[12px]">
                <div className="flex justify-between items-center mt-[8px] ml-[12px] w-[444px]">
                  <div className="flex flex-col gap-[2px] w-[70px] text-left">
                    <span className="text-[13px] font-medium text-[#000]">
                      ₹{r.Amount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                      TOTAL AMOUNT
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] w-[70px] text-center">
                    <span className="text-[13px] font-medium text-[#000]">
                      {loan.TermMonths}M
                    </span>
                    <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                      TERM
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] w-[70px] text-right">
                    <span className="text-[13px] font-medium text-[#2a9266]">
                      {loan.repayments.filter((x) => x.Status === "paid").length} /{" "}
                      {loan.repayments.length}
                    </span>
                    <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                      REPAID
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {index < arr.length - 1 && <Separator />}
      </div>
    ))}
  </>
) : (
  <div className="text-xs text-gray-400 px-6 py-4">No repayment records</div>
)}

                </div>
              ))
            )}
            <div className="h-10" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RepaymentDrawer;
