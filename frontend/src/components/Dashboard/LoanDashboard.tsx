// components/Dashboard/LoanDashboard.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/api";

interface Loan {
  ID: string;
  BorrowerName: string;
  ApplicationDate: string;
  Amount: number;
  Status: string;
}

interface LoanDashboardProps {
  loans: Loan[];
  onRefresh: () => void;
  onError: (error: string) => void;
}

const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export default function LoanDashboard({ loans, onRefresh, onError }: LoanDashboardProps) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const normalizeStatus = (status: string) => status?.toLowerCase().trim();
  const isPending = (loan: Loan) => normalizeStatus(loan.Status) === "pending";

  const handleApproveConfirm = async () => {
    if (!selectedLoan) return;
    try {
      await apiService.approveLoan(selectedLoan.ID);
      setApproveOpen(false);
      setSelectedLoan(null);
      onRefresh();
    } catch (err: any) {
      onError(err.message || "Failed to approve loan");
      console.error("Approve error:", err);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedLoan || !reason.trim()) return;
    try {
      await apiService.rejectLoan(selectedLoan.ID, reason);
      setReason("");
      setRejectOpen(false);
      setSelectedLoan(null);
      onRefresh();
    } catch (err: any) {
      onError(err.message || "Failed to reject loan");
      console.error("Reject error:", err);
    }
  };

  const handleCancel = () => {
    setReason("");
    setRejectOpen(false);
    setSelectedLoan(null);
  };

  const handleApproveClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setApproveOpen(true);
  };

  const handleRejectClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setRejectOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="">
      <div className=" border border-secondary rounded-[20px] overflow-hidden">
        <Table className="border-collapse w-full">
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="text-slate-500 text-sm font-['Arial'] tracking-tight leading-none">
              <TableHead className="w-[25%] py-4 pl-4 font-normal text-left">
                <div className="flex items-center gap-1">
                  <span>Borrower’s Name</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M9.7999 11.3C10.1313 11.3 10.3999 11.5686 10.3999 11.9C10.3999 12.2314 10.1313 12.5 9.7999 12.5H6.1999C5.86853 12.5 5.5999 12.2314 5.5999 11.9C5.5999 11.5686 5.86853 11.3 6.1999 11.3H9.7999ZM11.3999 7.9C11.7313 7.9 11.9999 8.16863 11.9999 8.5C11.9999 8.83137 11.7313 9.1 11.3999 9.1H4.5999C4.26853 9.1 3.9999 8.83137 3.9999 8.5C3.9999 8.16863 4.26853 7.9 4.5999 7.9H11.3999ZM12.9999 4.5C13.3313 4.5 13.5999 4.76863 13.5999 5.1C13.5999 5.43137 13.3313 5.7 12.9999 5.7H2.9999C2.66853 5.7 2.3999 5.43137 2.3999 5.1C2.3999 4.76863 2.66853 4.5 2.9999 4.5H12.9999Z"
                      fill="#858699"
                    />
                  </svg>
                </div>
              </TableHead>

              <TableHead className="w-[25%] py-4 text-center font-normal">
                <div className="inline-flex items-center justify-center gap-1">
                  <span>Application Date</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M9.7999 11.3C10.1313 11.3 10.3999 11.5686 10.3999 11.9C10.3999 12.2314 10.1313 12.5 9.7999 12.5H6.1999C5.86853 12.5 5.5999 12.2314 5.5999 11.9C5.5999 11.5686 5.86853 11.3 6.1999 11.3H9.7999ZM11.3999 7.9C11.7313 7.9 11.9999 8.16863 11.9999 8.5C11.9999 8.83137 11.7313 9.1 11.3999 9.1H4.5999C4.26853 9.1 3.9999 8.83137 3.9999 8.5C3.9999 8.16863 4.26853 7.9 4.5999 7.9H11.3999ZM12.9999 4.5C13.3313 4.5 13.5999 4.76863 13.5999 5.1C13.5999 5.43137 13.3313 5.7 12.9999 5.7H2.9999C2.66853 5.7 2.3999 5.43137 2.3999 5.1C2.3999 4.76863 2.66853 4.5 2.9999 4.5H12.9999Z"
                      fill="#858699"
                    />
                  </svg>
                </div>
              </TableHead>

              <TableHead className="w-[20%] py-4 text-center font-normal">
                <div className="inline-flex items-center justify-center gap-1">
                  <span>Amount</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M9.7999 11.3C10.1313 11.3 10.3999 11.5686 10.3999 11.9C10.3999 12.2314 10.1313 12.5 9.7999 12.5H6.1999C5.86853 12.5 5.5999 12.2314 5.5999 11.9C5.5999 11.5686 5.86853 11.3 6.1999 11.3H9.7999ZM11.3999 7.9C11.7313 7.9 11.9999 8.16863 11.9999 8.5C11.9999 8.83137 11.7313 9.1 11.3999 9.1H4.5999C4.26853 9.1 3.9999 8.83137 3.9999 8.5C3.9999 8.16863 4.26853 7.9 4.5999 7.9H11.3999ZM12.9999 4.5C13.3313 4.5 13.5999 4.76863 13.5999 5.1C13.5999 5.43137 13.3313 5.7 12.9999 5.7H2.9999C2.66853 5.7 2.3999 5.43137 2.3999 5.1C2.3999 4.76863 2.66853 4.5 2.9999 4.5H12.9999Z"
                      fill="#858699"
                    />
                  </svg>
                </div>
              </TableHead>

              <TableHead className="w-[30%] py-4 pr-4 text-center font-normal">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loans.map((loan) => (
              <TableRow
                key={loan.ID}
                className={`text-stone-950 text-sm font-['Arial'] leading-none tracking-tight ${
                  loans.indexOf(loan) === loans.length - 1
                    ? "rounded-b-[20px]"
                    : "border-b border-secondary"
                }`}
              >
                <TableCell className="w-32 underline py-4 pl-4">
                  {titleCase(loan.BorrowerName)}
                </TableCell>
                <TableCell className="w-36 text-center">
                  {formatDate(loan.ApplicationDate)}
                </TableCell>
                <TableCell className="w-24 text-center">
                  {formatAmount(loan.Amount)}
                </TableCell>
                <TableCell className="w-60">
                  <div className="flex justify-center items-center gap-2">
                    {isPending(loan) && (
                      <>
                        <button
                          className="px-2 py-1 bg-zinc-100 rounded-[70px] inline-flex justify-center items-center gap-2 text-center text-stone-950 text-xs font-normal font-['Roobert_TRIAL'] shadow-none hover:bg-zinc-200 focus:ring-0 focus:outline-none"
                          onClick={() => handleApproveClick(loan)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-zinc-100 rounded-[70px] inline-flex justify-center items-center gap-2 text-center text-stone-950 text-xs font-normal font-['Roobert_TRIAL'] shadow-none hover:bg-zinc-200 focus:ring-0 focus:outline-none"
                          onClick={() => handleRejectClick(loan)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="px-2 py-1 bg-zinc-100 rounded-[70px] inline-flex justify-center items-center gap-2 text-center text-stone-950 text-xs font-normal font-['Roobert_TRIAL'] shadow-none hover:bg-zinc-200 focus:ring-0 focus:outline-none"
                      onClick={() => console.log("Create report for loan:", loan.ID)}
                    >
                      Create Report
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No loans found for this status.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-[579px] [&>button]:hidden">
          <Card className="relative w-[579px] bg-white rounded-[20px] border border-solid border-border">
            <CardContent className="p-0">
              <DialogTrigger asChild>
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-solid border-border bg-white hover:bg-gray-50 transition-colors">
                  <X className="w-3 h-3 text-black" />
                </button>
              </DialogTrigger>
              <div className="py-6 px-14 ">
                <h2 className="font-roobert font-normal text-black text-xl tracking-[0.25px] leading-[22px]">
                  Are you sure that you want to approve this loan application?
                </h2>
              </div>
              <div className="py-6 px-14 flex items-center justify-center gap-5">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[229px] h-10 rounded-[70px]"
                  >
                    <span className="font-roobert font-semibold text-sm text-center ">
                      No, Go Back
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="w-[229px] h-10 rounded-[70px]"
                    onClick={handleApproveConfirm}
                  >
                    <span className="font-roobert font-semibold text-sm text-center ">
                      Yes, Confirm
                    </span>
                  </Button>
                </DialogTrigger>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-[579px] [&>button]:hidden">
          <Card className="relative w-[579px] bg-white rounded-[20px] border border-solid border-border">
            <CardContent className="p-0">
              <DialogTrigger asChild>
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-solid border-border bg-white hover:bg-gray-50 transition-colors">
                  <X className="w-3 h-3 text-black" />
                </button>
              </DialogTrigger>
              <div className="py-6 px-14">
                <h2 className="font-roobert font-normal text-black text-xl tracking-[0.25px] leading-[22px] mb-6">
                  Reason for rejection
                </h2>
                <div className="space-y-4">
                  <Input
                    id="reason"
                    placeholder="Enter reason here."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className=" rounded-lg border border-gray-300 focus:border-black focus:ring-0"
                  />
                  <div className="flex justify-between gap-3 pt-4">
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="w-[229px] h-10 rounded-[70px]"
                      >
                        <span className="font-roobert font-semibold text-sm text-center ">
                          Cancel
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="w-[229px] h-10 rounded-[70px]"
                        onClick={handleRejectConfirm}
                        disabled={!reason.trim()}
                      >
                        <span className="font-roobert font-semibold text-sm text-center ">
                          Yes, Confirm
                        </span>
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}