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
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M9 0C8.46263 0 8.02703 0.435624 8.02703 0.972973V8.02706H0.972973C0.435624 8.02706 0 8.46266 0 9.00003C0 9.5374 0.435624 9.973 0.972973 9.973H8.02703V17.027C8.02703 17.5644 8.46263 18 9 18C9.53737 18 9.97297 17.5644 9.97297 17.027V9.973H17.027C17.5644 9.973 18 9.5374 18 9.00003C18 8.46266 17.5644 8.02706 17.027 8.02706H9.97297V0.972973C9.97297 0.435624 9.53737 0 9 0Z" fill="black"/>
</svg>
            </button>
            <span className="text-black text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCard;
