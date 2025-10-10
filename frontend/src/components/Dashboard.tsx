import { FunctionComponent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Dashboard: FunctionComponent = () => {
  const navigationItems = [
    { label: 'Dashboard', active: true },
    { label: 'Loans', active: false },
    { label: 'Settings', active: false },
  ];

  const stats = [
    { label: 'Outstanding Balance', value: '₹5,00,000' },
    { label: 'Repayment Due', value: '₹40,000' },
    { label: 'Active Loans', value: '6' },
    { label: 'Credit Score', value: '750' },
  ];

  const loanCards = [
    { amount: '₹10,333', bank: 'IDFC First Bank' },
    { amount: '₹10,333', bank: 'IDFC First Bank' },
    { amount: '₹10,333', bank: 'IDFC First Bank' },
    { amount: '₹10,333', bank: 'IDFC First Bank' },
  ];

  const quickAccessItems = [
    { label: 'My Loans', icon: '📄' },
    { label: 'Apply for a new loan', icon: '➕' },
    { label: 'Repayments', icon: '💰' },
  ];

  const filterButtons = [
    { label: 'Approved', active: true },
    { label: 'Pending', active: false },
    { label: 'Rejected', active: false },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#001336] min-h-screen">
        <div className="p-5 pt-11">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-full px-4 py-4 transition-colors ${
                  item.active 
                    ? 'bg-white text-[#001336]' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium tracking-wide">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-medium">Hi Divanshu</h1>
            <p className="text-xl text-[#9d9d9d] mt-3">
              Welcome back, here's your loan overview
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#f9fafb] rounded-full px-3 py-1">
            <Avatar className="h-10 w-10 bg-black">
              <AvatarFallback className="bg-black text-white text-sm">
                DG
              </AvatarFallback>
            </Avatar>
            <span className="text-black font-medium">Divanshu Garg</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#f4f9ff] border-none">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <h3 className="text-base font-medium">{stat.label}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#001336]">
                      {stat.value}
                    </span>
                    <div className="w-6 h-6">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m9 18 6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Loan Application Card */}
          <div className="col-span-2">
            <Card className="bg-white border border-white overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="flex-1 bg-gradient-to-r from-blue-50 to-white p-8">
                    <div className="text-center space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Total Loan Approved
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          ₹10,00,000
                        </p>
                      </div>
                      <Button className="bg-black text-white rounded-full px-8 py-4 hover:bg-gray-800">
                        Apply for a Loan
                      </Button>
                    </div>
                  </div>
                  <div className="w-48 bg-blue-100 flex items-center justify-center">
                    <div className="text-6xl">📊</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Loans Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Loans</h2>
                <Button variant="ghost" className="rounded-full gap-2">
                  View all
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth={2}/>
                  </svg>
                </Button>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-6">
                {filterButtons.map((button, index) => (
                  <Badge
                    key={index}
                    variant={button.active ? "default" : "secondary"}
                    className={`rounded-full px-3 py-1 cursor-pointer ${
                      button.active 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {button.label}
                  </Badge>
                ))}
              </div>

              {/* Loan Cards */}
              <div className="grid grid-cols-2 gap-4">
                {loanCards.map((loan, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Loan Amount</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {loan.amount}
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-lg">🏦</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100"></div>

                        {/* Bank Info */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Issued by:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {loan.bank}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Access */}
          <div>
            <Card className="bg-blue-50 border-none">
              <CardContent className="p-6">
                <div className="text-center space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
                  
                  <div className="space-y-4">
                    {quickAccessItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-center">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;