import { Sidebar } from "@/components/Dashboard/Sidebar";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { LoanApplicationPage } from "@/components/Dashboard/LoanApplication/LoanApplicationPage";

export default function LoanPage() {
  const user = { profile: { fullName: "Divanshu Garg" } };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56 p-8">
        <DashboardHeader user={user} />
        <div className="mt-8">
          <LoanApplicationPage />
        </div>
      </div>
    </div>
  );
}
