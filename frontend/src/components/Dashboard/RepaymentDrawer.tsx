import { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

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
  InterestRate: number;
  TermMonths: number;
  LoanType: string;
  Status: string;
  ApplicationDate?: string;
  ApprovalDate?: string;
  RejectionReason?: string | null;
  repayments?: Repayment[];
}

const RepaymentDrawer = ({
  open,
  onClose,
  loanId,
}: {
  open: boolean;
  onClose: () => void;
  loanId?: string;
}) => {
  const { token } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaid, setShowPaid] = useState(false);
  const [confirmRepayment, setConfirmRepayment] = useState<{
    id: string;
    amount: number;
    dueDate: string;
  } | null>(null);

  useEffect(() => {
    if (open && token) fetchLoansAndRepayments();
  }, [open, token, loanId]);

  const fetchLoansAndRepayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetched = await apiService.getMyLoans();
      const loansArray: Loan[] = Array.isArray(fetched) ? fetched : [];

      const approved = loansArray.filter(
        (l) => (l.Status || "").toString().toLowerCase() === "approved" && (!loanId || l.ID === loanId)
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
            normalized.sort((a, b) => new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime());
            return {
              ...loan,
              InterestRate: Number(loan.InterestRate || 0),
              repayments: normalized,
            };
          } catch (err) {
            console.error("Failed to load repayments for loan", loan.ID, err);
            return { ...loan, InterestRate: 0, repayments: [] as Repayment[] };
          }
        })
      );

      setLoans(withRepayments);
    } catch (err: any) {
      console.error("Failed to fetch loans:", err);
      setError(err.message || "Failed to load loans");
      toast.error(err.message || "Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  const handlePayRepayment = async (repaymentId: string) => {
    try {
      setLoading(true);
      await apiService.payRepayment(repaymentId);
      toast.success("Repayment successful!");
      await fetchLoansAndRepayments();
    } catch (err: any) {
      setError(err.message || "Failed to process repayment");
      toast.error(err.message || "Failed to process repayment");
    } finally {
      setLoading(false);
      setConfirmRepayment(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const daysLeftLabel = (dueDate?: string) => {
    if (!dueDate) return "";
    const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff > 1) return `${diff} DAYS LEFT`;
    if (diff === 1) return `1 DAY LEFT`;
    if (diff === 0) return `DUE TODAY`;
    return `DUE`;
  };

  const getStatusColor = (status: string, isFirst: boolean, dueDate?: string) => {
    if (status.toLowerCase() === "paid") return "#2a9266";
    if (isFirst && dueDate && daysLeftLabel(dueDate).includes("DUE")) return "#ff3e3e";
    return isFirst ? "#ff3e3e" : "#0e0e0e";
  };

  const calculateTotalDue = (repayments: Repayment[]) => {
    return repayments
      .filter((r) => r.Status.toLowerCase() !== "paid")
      .reduce((sum, r) => sum + r.Amount, 0);
  };

  const calculateTotalPaid = (repayments: Repayment[]) => {
    return repayments
      .filter((r) => r.Status.toLowerCase() === "paid")
      .reduce((sum, r) => sum + r.Amount, 0);
  };

  const handleDownloadStatement = (loan: Loan) => {
    toast("Statement download initiated (mocked)", { icon: "📄" });
  };

  const nextDueDate = (repayments: Repayment[]) => {
    const unpaid = repayments.filter((r) => r.Status.toLowerCase() !== "paid");
    return unpaid.length > 0 ? formatDate(unpaid[0].DueDate) : "-";
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
      <DrawerContent className="font-roobert h-full bg-white outline outline-gray-200 p-0 flex flex-col overflow-x-hidden overflow-y-auto min-w-[400px] sm:min-w-[501px] max-w-[600px]">
        <div className="flex-grow overflow-y-auto w-full">
          <div className="min-h-full border border-[#eaeaea] w-full">
            <div className="px-4 sm:px-6 pt-6 pb-4 flex justify-between items-center h-[24px] relative z-[101]">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#000]">
                {loanId ? "Loan Repayment Schedule" : "Repayment Schedule"}
              </h2>
              <button
                onClick={onClose}
                className="w-[28px] h-[28px] bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
                aria-label="Close repayment drawer"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {loading ? (
              <div className="px-4 sm:px-6 py-8 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            ) : error ? (
              <div className="px-4 sm:px-6 py-8 text-center text-red-500 text-sm">
                {error}
                <Button
                  variant="link"
                  onClick={fetchLoansAndRepayments}
                  className="mt-2 text-blue-600"
                  aria-label="Retry loading loans"
                >
                  Retry
                </Button>
              </div>
            ) : loans.length === 0 ? (
              <div className="px-4 sm:px-6 py-10 text-center text-gray-500 text-sm">
                {loanId ? "No repayments for this loan." : "No approved loans found."}
              </div>
            ) : (
              loans.map((loan, idx) => (
                <div key={loan.ID} className="px-4 sm:px-6 py-4" style={{ zIndex: 50 - idx }}>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                      {loan.LoanType} Loan (ID: {loan.ID.slice(0, 8)})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-600">Borrower</p>
                        <p className="font-medium">{loan.BorrowerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Loan Amount</p>
                        <p className="font-medium">₹{loan.Amount.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interest Rate</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="font-medium">
                                {(loan.InterestRate * 100).toFixed(1)}% p.a.
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              Annual interest rate applied to the loan
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div>
                        <p className="text-gray-600">Total with Interest</p>
                        <p className="font-medium">
                          ₹{(
                            loan.Amount * (1 + loan.InterestRate * (loan.TermMonths / 12))
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Application Date</p>
                        <p className="font-medium">{formatDate(loan.ApplicationDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Approval Date</p>
                        <p className="font-medium">{formatDate(loan.ApprovalDate)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-gray-600 text-sm">Repayment Progress</p>
                        <Progress
                          value={
                            (loan.repayments?.filter((r) => r.Status.toLowerCase() === "paid").length /
                              loan.repayments?.length) * 100
                          }
                          className="w-32 sm:w-48 mt-1"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadStatement(loan)}
                        className="flex items-center gap-2"
                        aria-label={`Download statement for ${loan.LoanType} loan`}
                      >
                        <Download className="w-4 h-4" />
                        Download Statement
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-900">Repayment Schedule</h4>
                    <Button
                      variant="link"
                      onClick={() => setShowPaid(!showPaid)}
                      className="text-blue-600 text-sm font-light"
                      aria-label={showPaid ? "Hide paid repayments" : "Show paid repayments"}
                    >
                      {showPaid ? "Hide Paid" : "Show Paid"}
                    </Button>
                  </div>

                  {loan.repayments && loan.repayments.length > 0 ? (
                    loan.repayments
                      .filter((r) => showPaid || r.Status.toLowerCase() !== "paid")
                      .map((r, index, arr) => (
                        <div key={r.ID}>
                          <div className="flex justify-center">
                            <div>
                              <div
                                className={`flex w-[70px] h-[23px] justify-center items-center rounded-[5px] mt-${
                                  index === 0 ? "[26px]" : "[18.333px]"
                                } ml-[28px] text-white text-[8px] font-semibold tracking-[0.72px]`}
                                style={{ backgroundColor: getStatusColor(r.Status, index === 0, r.DueDate) }}
                              >
                                {r.Status.toLowerCase() === "paid"
                                  ? "PAID"
                                  : index === 0
                                  ? daysLeftLabel(r.DueDate)
                                  : formatDate(r.DueDate)}
                              </div>

                              <div
                                className="w-[468px] h-[135px] bg-white rounded-[10px] relative overflow-hidden mt-[-4px] ml-[16px]"
                                style={{
                                  borderWidth: 0.5,
                                  borderColor: index === 0 ? "#ff3e3e" : "#eaeaea",
                                }}
                              >
                                <div className="flex justify-between items-center mt-[12px] ml-[12px] w-[444px]">
                                  <span className="text-[14px] font-medium text-[#000]">
                                    {loan.LoanType || "Loan"} (₹{loan.Amount.toLocaleString("en-IN")})
                                  </span>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        onClick={() =>
                                          setConfirmRepayment({
                                            id: r.ID,
                                            amount: r.Amount,
                                            dueDate: r.DueDate,
                                          })
                                        }
                                        className="flex items-center gap-[8px] px-[8px] py-[1px] h-7 rounded-full bg-[#0e0e0e] text-white"
                                        disabled={r.Status.toLowerCase() === "paid" || loading}
                                        aria-label={`Pay ₹${r.Amount.toLocaleString("en-IN")} for repayment due ${formatDate(
                                          r.DueDate
                                        )}`}
                                      >
                                        <span className="text-[12px] font-semibold">Repay Now</span>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="6"
                                          height="10"
                                          viewBox="0 0 6 10"
                                          fill="none"
                                        >
                                          <path
                                            d="M5.32903 4.44598L1.03314 0.171128C0.918166 0.0600806 0.764174 -0.00136593 0.604333 2.30454e-05C0.444492 0.00141202 0.291591 0.0655253 0.178562 0.178554C0.0655328 0.291583 0.00141949 0.444485 3.05176e-05 0.604326C-0.00135846 0.764167 0.0600881 0.918159 0.171136 1.03313L4.03602 4.87698L0.186119 8.70585C0.127893 8.76208 0.0814506 8.82935 0.0495009 8.90373C0.0175511 8.97811 0.00073391 9.0581 3.05176e-05 9.13905C-0.000672875 9.21999 0.0147521 9.30027 0.0454044 9.37519C0.0760568 9.45011 0.121323 9.51817 0.178562 9.57541C0.235802 9.63265 0.303867 9.67792 0.378787 9.70857C0.453708 9.73922 0.533982 9.75465 0.614928 9.75394C0.695873 9.75324 0.775868 9.73642 0.850244 9.70447C0.924621 9.67252 0.991889 9.62608 1.04813 9.56786L5.32903 5.30799C5.44332 5.19367 5.50752 5.03863 5.50752 4.87698C5.50752 4.71533 5.44332 4.5603 5.32903 4.44598Z"
                                            fill="#FFFFFF"
                                          />
                                        </svg>
                                      </Button>
                                    </DialogTrigger>
                                    {confirmRepayment && (
                                      <DialogContent className="p-0 border-0 bg-transparent max-w-[579px] [&>button]:hidden">
                                        <Card className="relative w-[579px] bg-white rounded-[20px] border border-solid border-border">
                                          <CardContent className="p-0">
                                            <DialogTrigger asChild>
                                              <button
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-solid border-border bg-white hover:bg-gray-50 transition-colors"
                                                aria-label="Close repayment confirmation dialog"
                                              >
                                                <X className="w-3 h-3 text-black" />
                                              </button>
                                            </DialogTrigger>
                                            <div className="py-6 px-14">
                                              <h2 className="font-roobert font-normal text-black text-xl tracking-[0.25px] leading-[22px]">
                                                Are you sure you want to repay ₹{confirmRepayment.amount.toLocaleString("en-IN")} due {formatDate(confirmRepayment.dueDate)}?
                                              </h2>
                                            </div>
                                            <div className="py-6 px-14 flex items-center justify-center gap-5">
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  className="w-[229px] h-10 rounded-[70px]"
                                                  aria-label="Cancel repayment"
                                                >
                                                  <span className="font-roobert font-semibold text-sm text-center">
                                                    No, Go Back
                                                  </span>
                                                </Button>
                                              </DialogTrigger>
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="default"
                                                  className="w-[229px] h-10 rounded-[70px]"
                                                  onClick={() => handlePayRepayment(confirmRepayment.id)}
                                                  aria-label="Confirm repayment"
                                                >
                                                  <span className="font-roobert font-semibold text-sm text-center">
                                                    Yes, Confirm
                                                  </span>
                                                </Button>
                                              </DialogTrigger>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </DialogContent>
                                    )}
                                  </Dialog>
                                </div>
                                <div className="mt-[8px] ml-[12px] w-[444px]">
                                  <div className="flex flex-col gap-[6px]">
                                    <div className="flex justify-between">
                                      <div className="flex flex-col gap-[2px]">
                                        <span className="text-[12px] font-medium text-[#000]">
                                          ₹{r.Amount.toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                                          REPAYMENT AMOUNT
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-[2px] text-right">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <span className="text-[12px] font-medium text-[#000]">
                                                {loan.InterestRate > 0
                                                  ? `${(loan.InterestRate * 100).toFixed(1)}% p.a.`
                                                  : "N/A"}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Annual interest rate applied to the loan
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                                          INTEREST RATE
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <div className="flex flex-col gap-[2px]">
                                        <span className="text-[12px] font-medium text-[#000]">
                                          ₹{calculateTotalDue(loan.repayments).toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-[8px] font-semibold text-[#858699] tracking-[0.72px]">
                                          TOTAL DUE
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-[2px] text-right">
                                        <span className="text-[12px] font-medium text-[#2a9266]">
                                          {loan.repayments.filter((x) => x.Status.toLowerCase() === "paid").length} /{" "}
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
                          </div>
                          {index < arr.length - 1 && <Separator />}
                        </div>
                      ))
                  ) : (
                    <div className="text-xs text-gray-400 px-6 py-4">No repayment records</div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="text-base font-medium text-gray-900">Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-600">Total Paid</p>
                        <p className="font-medium">
                          ₹{calculateTotalPaid(loan.repayments || []).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Due</p>
                        <p className="font-medium">
                          ₹{calculateTotalDue(loan.repayments || []).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Payment Due</p>
                        <p className="font-medium">{nextDueDate(loan.repayments || [])}</p>
                      </div>
                    </div>
                  </div>
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