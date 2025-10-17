
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { X } from "lucide-react";

const RepaymentDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="font-roobert h-full bg-white outline outline-gray-200 p-0 flex flex-col overflow-x-hidden overflow-y-auto min-w-[501px]">
        <div className="flex-grow overflow-y-auto w-full">
          <div className="min-h-full border border-[#eaeaea] w-full">
            <div className="px-4 pt-6 pb-4 flex justify-between items-center h-[24px] relative z-[101]">
              <div className="text-[24px] font-medium leading-[24px] text-[#000]">Repayment Schedule</div>
              <button 
                onClick={onClose} 
                className="w-[28px] h-[28px] bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="flex w-[70px] h-[23px] justify-center items-center bg-[#ff3e3e] rounded-[5px] relative z-[5] mt-[26px] ml-[28px]">
              <span className="h-[10px] text-[8px] font-semibold leading-[9.682px] text-[#fff] tracking-[0.72px] whitespace-nowrap">1 DAY LEFT</span>
            </div>

            <div className="w-[468px] h-[93px] bg-white rounded-[10px] border-[0.5px] border-[#ff3e3e] relative overflow-hidden z-[9] mt-[-4px] ml-[16px]">
              <div className="flex w-[117px] px-[12px] py-[5px] gap-[4px] justify-center items-center bg-[#f3f3f3] rounded-full relative z-10 mt-[-145px] ml-[183px]">
                <span className="w-[93px] h-[22px] shrink-0 text-[14px] font-normal leading-[22px] text-[#0e0e0c] tracking-[0.18px] text-center whitespace-nowrap"></span>
              </div>
              <div className="flex w-[444px] justify-between items-center relative z-[23] mt-[126.5px] ml-[12px]">
                <div className="flex w-[101px] items-center shrink-0">
                  <span className="h-[17px] text-[14px] font-medium leading-[16.943px] text-[#000] tracking-[-0.14px] whitespace-nowrap">IDFC Bank First</span>
                </div>
                <div className="flex w-[102px] px-[8px] py-[4px] gap-[12px] justify-center items-center shrink-0 rounded-full relative z-[27]">
                  <div className="flex w-[62px] gap-[8px] items-center">
                    <span className="w-[62px] h-[15px] text-[12px] font-[650] leading-[15px] text-[#0e0e0e] text-center whitespace-nowrap">Repay Now</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] text-gray-700">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div className="w-[468px] h-[45px] bg-[#f9f9f9] relative overflow-hidden z-[12] mt-[12.5px]">
                <div className="flex w-[444px] justify-between items-center relative z-[13] mt-[8px] ml-[12px]">
                  <div className="flex w-[69px] flex-col gap-[2px] items-start shrink-0">
                    <span className="h-[16px] self-stretch text-[13px] font-medium leading-[15.733px] text-[#000] whitespace-nowrap">10,000</span>
                    <span className="h-[10px] text-[8px] font-semibold leading-[9.682px] text-[#858699] tracking-[0.72px] whitespace-nowrap">TOTAL AMOUNT</span>
                  </div>
                  <div className="flex w-[69px] flex-col gap-[2px] items-center shrink-0">
                    <span className="h-[16px] self-stretch text-[13px] font-medium leading-[15.733px] text-[#000] text-center whitespace-nowrap">5%</span>
                    <span className="h-[10px] self-stretch text-[8px] font-semibold leading-[9.682px] text-[#858699] tracking-[0.72px] text-center whitespace-nowrap">INTEREST</span>
                  </div>
                  <div className="flex w-[70px] flex-col gap-[2px] items-start shrink-0">
                    <span className="h-[16px] self-stretch text-[13px] font-medium leading-[15.733px] text-[#2a9266] text-right whitespace-nowrap">50,000</span>
                    <span className="h-[10px] self-stretch text-[8px] font-semibold leading-[9.682px] text-[#858699] tracking-[0.72px] text-right whitespace-nowrap">REPAID</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex pt-3 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="45" viewBox="0 0 6 45" fill="none">
                <path d="M2.66602 8.13007e-05C1.19326 8.12364e-05 -0.000651057 1.19399 -0.000651121 2.66675C-0.000651186 4.13951 1.19326 5.33341 2.66602 5.33341C4.13877 5.33341 5.33268 4.13951 5.33268 2.66675C5.33268 1.19399 4.13878 8.13651e-05 2.66602 8.13007e-05ZM2.66601 39.0001C1.19325 39.0001 -0.000652762 40.194 -0.000652826 41.6667C-0.00065289 43.1395 1.19325 44.3334 2.66601 44.3334C4.13877 44.3334 5.33268 43.1395 5.33268 41.6667C5.33268 40.194 4.13877 39.0001 2.66601 39.0001ZM2.66602 2.66675L2.16602 2.66675L2.16602 3.64175L2.66602 3.64175L3.16602 3.64175L3.16602 2.66675L2.66602 2.66675ZM2.66602 5.59175L2.16602 5.59175L2.16602 7.54175L2.66602 7.54175L3.16602 7.54175L3.16602 5.59175L2.66602 5.59175ZM2.66602 9.49175L2.16602 9.49175L2.16602 11.4417L2.66602 11.4417L3.16602 11.4417L3.16602 9.49175L2.66602 9.49175ZM2.66602 13.3917L2.16602 13.3917L2.16602 15.3417L2.66602 15.3417L3.16602 15.3417L3.16602 13.3917L2.66602 13.3917ZM2.66601 17.2917L2.16601 17.2917L2.16601 19.2417L2.66601 19.2417L3.16601 19.2417L3.16601 17.2917L2.66601 17.2917ZM2.66601 21.1917L2.16601 21.1917L2.16601 23.1418L2.66601 23.1418L3.16601 23.1418L3.16601 21.1917L2.66601 21.1917ZM2.66601 25.0917L2.16601 25.0917L2.16601 27.0417L2.66601 27.0417L3.16601 27.0417L3.16601 25.0917L2.66601 25.0917ZM2.66601 28.9918L2.16601 28.9918L2.16601 30.9418L2.66601 30.9418L3.16601 30.9418L3.16601 28.9918L2.66601 28.9918ZM2.66601 32.8918L2.16601 32.8918L2.16601 34.8418L2.66601 34.8418L3.16601 34.8418L3.16601 32.8918L2.66601 32.8918ZM2.66601 36.7918L2.16601 36.7918L2.16601 38.7418L2.66601 38.7418L3.16601 38.7418L3.16601 36.7918L2.66601 36.7918ZM2.66601 40.6918L2.16601 40.6918L2.16601 41.6667L2.66601 41.6667L3.16601 41.6667L3.16601 40.6918L2.66601 40.6918Z" fill="#858699"/>
              </svg>
            </div>

            <div className="flex w-[70px] h-[23px] justify-center items-center bg-[#0e0e0e] rounded-[5px] relative z-[6] mt-[18.333px] ml-[28px]">
              <span className="h-[10px] text-[8px] font-semibold leading-[9.682px] text-[#fff] tracking-[0.72px] whitespace-nowrap">12/10/2025</span>
            </div>

            <div className="w-[468px] h-[93px] bg-white rounded-[10px] border-[0.5px] border-[#eaeaea] relative overflow-hidden z-[32] mt-[-4px] ml-[16px]">
              <div className="flex w-[444px] justify-between items-center relative z-[46] mt-[12.5px] ml-[12px]">
                <span className="h-[17px] text-[14px] font-medium leading-[16.943px] text-[#000] tracking-[-0.14px] whitespace-nowrap">IDFC Bank First</span>
                <div className="flex w-[102px] px-[8px] py-[4px] gap-[12px] justify-center items-center shrink-0 rounded-full">
                  <span className="w-[62px] h-[15px] text-[12px] font-[650] leading-[15px] text-[#0e0e0e] text-center whitespace-nowrap">Repay Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] text-gray-700">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div className="w-[468px] h-[45px] bg-[#f9f9f9] relative overflow-hidden z-[35] mt-[12.5px]">
                <div className="flex w-[444px] justify-between items-center relative z-[36] mt-[8px] ml-[12px]">
                  <div className="flex w-[69px] flex-col gap-[2px] items-start shrink-0">
                    <span className="h-[16px] self-stretch text-[13px] font-medium leading-[15.733px] text-[#000] whitespace-nowrap">10,000</span>
                    <span className="h-[10px] text-[8px] font-semibold leading-[9.682px] text-[#858699] tracking-[0.72px] whitespace-nowrap">TOTAL AMOUNT</span>
                  </div>
                  <div className="flex w-[69px] flex-col gap-[2px] items-center shrink-0">
                    <span className="h-[16px] self-stretch text-[13px] font-medium leading-[15.733px] text-[#000] text-center whitespace-nowrap">5%</span>
                    <span className="h-[10px] self-stretch text-[8px] font-semibold leading-[9.682px] text-[#858699] tracking-[0.72px] text-center whitespace-nowrap">INTEREST</span>
                  </div>
                  <div className="flex w-[70px] flex-col gap-[2px] items-start shrink-0">
                    <span className="h-[16px] self-stretch text-[13px] font-medium leading-[15.733px] text-[#2a9266] text-right whitespace-nowrap">50,000</span>
                    <span className="h-[10px] self-stretch text-[8px] font-semibold leading-[9.682px] text-[#858699] tracking-[0.72px] text-right whitespace-nowrap">REPAID</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-10"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RepaymentDrawer;
