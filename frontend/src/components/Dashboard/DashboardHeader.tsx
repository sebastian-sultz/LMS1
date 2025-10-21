import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  user?: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const capitalizeWords = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getUserName = () => {
    if (!user) return "User";
    let name = "";
    if (user.profile?.fullName) name = user.profile.fullName;
    return capitalizeWords(name);
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = getUserName();
  const userInitials = getUserInitials();
  const firstName = capitalizeWords(userName.split(' ')[0]);

  return (
    <div className="font-roobert flex items-center justify-between w-full pb-10">
      <div>
        <h1 className="text-2xl font-semibold">Hi {firstName}</h1>
        <p className="font-roobert text-secHeading text-xl ">
          Welcome back, here's your loan overview
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="bg-primary ">
          <AvatarFallback className="text-white p-2">{userInitials}</AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline leading-5 ">
          {userName}
        </span>
      </div>
    </div>
  );
}