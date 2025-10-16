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

export default function LoanDashboard() {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const rows = [
    { name: "Arun Kumar", date: "09/10/2025", amount: "₹1,00,000" },
    { name: "Sushil", date: "09/10/2025", amount: "₹2,50,000" },
    { name: "Akshay", date: "09/10/2025", amount: "₹70,000" },
    { name: "Sushil", date: "09/10/2025", amount: "₹50,00,000" },
    { name: "Akshay", date: "09/10/2025", amount: "₹1,00,000" },
    { name: "Arun Kumar", date: "09/10/2025", amount: "₹2,50,000" },
    
    { name: "Arun Kumar", date: "09/10/2025", amount: "₹2,50,000" },
    { name: "Akshay", date: "09/10/2025", amount: "₹70,000" },
    { name: "Akshay", date: "09/10/2025", amount: "₹50,00,000" },
    { name: "Sushil", date: "09/10/2025", amount: "₹1,00,000" },
    { name: "Akshay", date: "09/10/2025", amount: "₹50,00,000" },
  ];

  const handleApproveConfirm = () => {
    setApproveOpen(false);
  };

  const handleRejectConfirm = () => {
    if (reason.trim()) {
      console.log("Reject reason:", reason);
    }
    setReason("");
    setRejectOpen(false);
  };

  const handleCancel = () => {
    setReason("");
    setRejectOpen(false);
  };

  return (
    <div className="">
      <div className=" border border-secondary rounded-[20px] overflow-hidden">
        <Table className="border-collapse w-full">
          {/* Table Header */}
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="text-slate-500 text-sm font-['Arial'] tracking-tight leading-none">
              {/* Borrower's Name */}
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

              {/* Application Date */}
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

              {/* Amount */}
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

              {/* Actions */}
              <TableHead className="w-[30%] py-4 pr-4 text-center font-normal">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                className={`text-stone-950 text-sm font-['Arial'] leading-none tracking-tight ${
                  index === rows.length - 1
                    ? "rounded-b-[20px]"
                    : "border-b border-secondary"
                }`}
              >
                <TableCell className="w-32 underline py-4 pl-4">
                  {row.name}
                </TableCell>
                <TableCell className="w-36 text-center">{row.date}</TableCell>
                <TableCell className="w-24 text-center">{row.amount}</TableCell>
                <TableCell className="w-60">
                  <div className="flex justify-center items-center gap-2">
                    {["Approve", "Reject", "Create Report"].map((label) => (
                      <button
                        key={label}
                        className="px-2 py-1 bg-zinc-100 rounded-[70px] inline-flex justify-center items-center gap-2 text-center text-stone-950 text-xs font-normal font-['Roobert_TRIAL'] shadow-none hover:bg-zinc-200 focus:ring-0 focus:outline-none"
                        onClick={
                          label === "Approve"
                            ? () => setApproveOpen(true)
                            : label === "Reject"
                            ? () => setRejectOpen(true)
                            : undefined
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
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