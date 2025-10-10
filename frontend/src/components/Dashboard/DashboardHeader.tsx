import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Replace with your data dynamically later
// const user = { name: "Divanshu Garg", initials: "DG" }

export function DashboardHeader() {
  return (
    <div className="font-roobert flex items-center justify-between w-full">
      <div>
        <h1 className="text-2xl font-semibold">Hi Divanshu</h1>
        {/* Replace static text with dynamic user.name */}
        <p className="font-roobert text-secHeading text-xl ">
          Welcome back, here’s your loan overview
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="bg-primary ">
          <AvatarFallback className="text-white p-2">DG</AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline leading-5 ">
          Divanshu Garg
        </span>
      </div>
    </div>
  )
}
