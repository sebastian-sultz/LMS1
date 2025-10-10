import React from "react";

const QuickAccessCard = () => {
  const quickAccessItems = [
    { label: "My Loans" },
    { label: "Apply for a new loan" },
    { label: "Repayments" },
  ];

  return (
    <div className="bg-bgCard  rounded-xl p-6 w-full max-w-md mx-auto text-center">
      <h2 className="text-lg font-bold mb-6">Quick Access</h2>
      <div className="flex justify-around">
        {quickAccessItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <button className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold hover:shadow-md transition-shadow">
              +
            </button>
            <span className="text-black text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCard;
