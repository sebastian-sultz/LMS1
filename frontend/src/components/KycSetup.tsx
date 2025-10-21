import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Img from "../assets/image.png";

const docs = ["PAN Card", "Aadhaar Card"];

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <g filter="url(#filter0_d_2_1631)">
      <path
        d="M14.374 2H13.1638H5.87469C5.38997 2 5 2.39732 5 2.89119V20.1209C5 20.6148 5.38997 21.0121 5.87469 21.0121H18.1203C18.6051 21.0121 18.995 20.6148 18.995 20.1209V6.35694L17.1466 4.50854C16.8826 4.24449 14.8829 2 14.374 2Z"
        fill="white"
      />
      <path
        d="M5.875 2.15039H14.374C14.3936 2.15039 14.45 2.16496 14.5518 2.22559C14.6466 2.28208 14.7609 2.36575 14.8896 2.4707C15.147 2.68053 15.449 2.9658 15.7461 3.26172C16.0426 3.55701 16.3324 3.86037 16.5645 4.10742C16.7941 4.35186 16.9728 4.54607 17.041 4.61426L18.8447 6.41797V20.1211C18.8446 20.5347 18.5193 20.8623 18.1201 20.8623H5.875C5.4758 20.8623 5.15048 20.5347 5.15039 20.1211V2.8916C5.15039 2.47792 5.47575 2.15039 5.875 2.15039Z"
        stroke="white"
        strokeWidth="0.3"
      />
    </g>
    <path
      d="M14.8835 2.27437L18.8631 6.09289C19.0395 6.26927 18.9951 6.53106 18.9951 6.77799V7.01709H14.978C14.4257 7.01709 13.978 6.56937 13.978 6.01709V2H14.2171C14.468 2 14.7071 2.09799 14.8835 2.27437Z"
      fill="#5F605B"
    />
    <defs>
      <filter
        id="filter0_d_2_1631"
        x="-1"
        y="-3"
        width="25.9951"
        height="31.0122"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="3" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2_1631"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2_1631"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const SuccessModal = ({
  open,
  onOpenChange: parentOnOpenChange,
  redirectPath = "/login",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectPath?: string;
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (open) {
      setProgress(0);
      setIsComplete(false);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 20);

      const successTimeout = setTimeout(() => {
        setIsComplete(true);
      }, 2000);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(successTimeout);
      };
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    parentOnOpenChange(newOpen);
    if (!newOpen) {
      console.log("Navigating to:", redirectPath);
      if (redirectPath === "/login") {
        logout();
      }
      navigate(redirectPath);
    }
  };

  const handleOkay = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 border-0 bg-transparent max-w-[579px] [&>button]:hidden">
        <DialogTitle className="sr-only">KYC Verification</DialogTitle>
        <DialogDescription className="sr-only">
          KYC verification process status
        </DialogDescription>
        <Card className="relative w-[579px] h-[478px] bg-white rounded-[20px] border border-solid border-border">
          <CardContent className="flex flex-col items-center h-full p-0">
            <div className="w-full pt-6">
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex flex-col items-center gap-2 w-full">
                  <h1 className="font-roobert font-bold text-black text-2xl text-center tracking-[0] leading-[22px] whitespace-nowrap">
                    {isComplete ? "Verification Complete" : "KYC Verification"}
                  </h1>
                </div>
              </div>
              <Separator className="w-full mt-3" />
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-between">
              <div className="w-[401px]">
                <p className="font-roobert font-normal text-secondary text-sm text-center tracking-[0] leading-[normal] py-1">
                  {!isComplete
                    ? "Your documents are being uploaded."
                    : "It will be reviewed shortly."}
                </p>
              </div>

              <div className="relative w-[366.46px] h-[195.69px] flex items-center justify-center">
                {!isComplete ? (
                  <svg width="367" height="196" viewBox="0 0 367 196" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="141.884" cy="35.2978" rx="35.1006" ry="35.2978" fill="#1E1E1E" fill-opacity="0.03"/>
<ellipse cx="97.0311" cy="165.9" rx="13.6502" ry="13.7269" fill="#1E1E1E" fill-opacity="0.03"/>
<ellipse cx="269.41" cy="16.0801" rx="15.9903" ry="16.0801" fill="#1E1E1E" fill-opacity="0.03"/>
<g filter="url(#filter0_d_5_2022)">
<rect x="169.049" y="60.1572" width="100.998" height="130.843" rx="10.813" fill="white"/>
</g>
<rect x="180.721" y="71.9756" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint0_linear_5_2022)"/>
<rect x="180.721" y="86.0234" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint1_linear_5_2022)"/>
<rect x="180.721" y="100.071" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint2_linear_5_2022)"/>
<rect x="180.721" y="114.119" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint3_linear_5_2022)"/>
<rect x="180.721" y="128.167" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint4_linear_5_2022)"/>
<rect x="180.721" y="142.214" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint5_linear_5_2022)"/>
<rect x="180.721" y="156.262" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint6_linear_5_2022)"/>
<rect x="180.721" y="170.31" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint7_linear_5_2022)"/>
<g filter="url(#filter1_d_5_2022)">
<rect x="129.955" y="32.1602" width="100.998" height="130.843" rx="10.813" fill="white"/>
</g>
<ellipse cx="152.07" cy="60.5331" rx="11.6813" ry="11.7469" fill="url(#paint8_linear_5_2022)"/>
<rect x="177.041" y="51.3184" width="38.4584" height="6.50599" rx="3.25299" fill="url(#paint9_linear_5_2022)"/>
<rect x="140.389" y="83.124" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint10_linear_5_2022)"/>
<rect x="140.389" y="97.1719" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint11_linear_5_2022)"/>
<rect x="140.389" y="111.219" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint12_linear_5_2022)"/>
<rect x="140.389" y="125.267" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint13_linear_5_2022)"/>
<rect x="140.389" y="139.315" width="75.1197" height="6.50599" rx="3.25299" fill="url(#paint14_linear_5_2022)"/>
<rect x="177.041" y="62.5234" width="20.4872" height="6.50599" rx="3.25299" fill="url(#paint15_linear_5_2022)"/>
<defs>
<filter id="filter0_d_5_2022" x="165.445" y="57.6342" width="108.207" height="138.051" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.0813"/>
<feGaussianBlur stdDeviation="1.80216"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5_2022"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5_2022" result="shape"/>
</filter>
<filter id="filter1_d_5_2022" x="115.371" y="18.6576" width="130.166" height="160.01" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="3.77089" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_5_2022"/>
<feOffset dy="1.0813"/>
<feGaussianBlur stdDeviation="5.40649"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5_2022"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5_2022" result="shape"/>
</filter>
<linearGradient id="paint0_linear_5_2022" x1="218.281" y1="71.9756" x2="218.281" y2="78.4816" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint1_linear_5_2022" x1="218.281" y1="86.0234" x2="218.281" y2="92.5294" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint2_linear_5_2022" x1="218.281" y1="100.071" x2="218.281" y2="106.577" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint3_linear_5_2022" x1="218.281" y1="114.119" x2="218.281" y2="120.625" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint4_linear_5_2022" x1="218.281" y1="128.167" x2="218.281" y2="134.673" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint5_linear_5_2022" x1="218.281" y1="142.214" x2="218.281" y2="148.72" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint6_linear_5_2022" x1="218.281" y1="156.262" x2="218.281" y2="162.768" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint7_linear_5_2022" x1="218.281" y1="170.31" x2="218.281" y2="176.816" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint8_linear_5_2022" x1="152.07" y1="48.7861" x2="152.07" y2="72.28" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint9_linear_5_2022" x1="196.27" y1="51.3184" x2="196.27" y2="57.8243" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint10_linear_5_2022" x1="177.949" y1="83.124" x2="177.949" y2="89.63" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint11_linear_5_2022" x1="177.949" y1="97.1719" x2="177.949" y2="103.678" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint12_linear_5_2022" x1="177.949" y1="111.219" x2="177.949" y2="117.725" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint13_linear_5_2022" x1="177.949" y1="125.267" x2="177.949" y2="131.773" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint14_linear_5_2022" x1="177.949" y1="139.315" x2="177.949" y2="145.821" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
<linearGradient id="paint15_linear_5_2022" x1="187.285" y1="62.5234" x2="187.285" y2="69.0294" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="1" stop-color="#EAEAEA"/>
</linearGradient>
</defs>
</svg>
                ) : (
                  <img
                    src={Img}
                    className="w-full h-full object-contain"
                    alt="Success"
                  />
                )}
              </div>

              <div className="w-[358px]">
                <p className="font-roobert font-normal text-secondary text-sm text-center tracking-[0] leading-[normal]">
                  {!isComplete ? "Hang tight – this usually takes under a minute." : ""}
                </p>
              </div>

              <div className="w-full flex flex-col items-center">
                {!isComplete ? (
                  <div className="w-full h-[63px] flex flex-col items-center gap-[9px]">
                    <div className="w-[356px] h-[19px] flex justify-center">
                      <div className="relative w-[284px] h-[19px]">
                        <div className="absolute top-0 w-full bg-[#EFEFEF] h-[19px] bg-border rounded-[10px]" />
                        <div
                          className="absolute top-0.5 h-[15px] shadow-[0px_1px_4px_#00000040] bg-[linear-gradient(90deg,rgba(171,172,194,1)_65%,rgba(133,134,153,1)_99%)] rounded-[10px] transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="w-[358px] h-[18px] font-roobert font-normal text-sm text-center tracking-[0] leading-[normal]">
                      <span className="font-roobert font-bold italic text-primary">
                        {progress}%
                      </span>
                      <span className="font-roobert font-medium italic text-secondary">
                        {" "}
                        processed...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <Button
                      className="w-[443px] h-14 rounded-[70px] relative -top-4"
                      onClick={handleOkay}
                    >
                      <span className="font-roobert font-semibold text-sm text-center">
                        Okay
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-solid border-border hover:bg-gray-100"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </DialogTrigger>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

type FloatingLabelFileUploaderProps = {
  label?: string;
  id?: string;
  dynamicLabel?: string | null;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
};

const FloatingLabelFileUploader = ({
  label = "UPLOAD DOCUMENT",
  id = "documentUpload",
  dynamicLabel,
  onFileSelect,
  selectedFile,
}: FloatingLabelFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const effectiveLabel = selectedFile
    ? (dynamicLabel || label).toUpperCase()
    : label;

  const handleWrapperClick = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUploadAnother = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const promptContent = selectedFile ? (
    <div className="flex items-center justify-between w-full h-full text-sm">
      <div className="flex items-center gap-2 truncate max-w-[65%]">
        <DocumentIcon />
        <span className="truncate max-w-full font-bold text-black text-sm uppercase">
          {selectedFile.name}
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-end items-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4"
          >
            <path
              d="M7 17L17 7"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 7H17V17"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Button
          onClick={handleUploadAnother}
          variant="ghost"
          className="text-xs font-semibold underline shrink-0 h-auto p-0 flex items-center gap-1 uppercase tracking-tight"
        >
          UPLOAD ANOTHER
        </Button>
      </div>
    </div>
  ) : (
    <div className="inline-flex items-center gap-[9px] w-full h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M16.5003 10.5C19.8141 10.5 22.5003 13.1863 22.5003 16.5C22.5003 19.8137 19.8141 22.5 16.5003 22.5C13.1867 22.5 10.5004 19.8137 10.5004 16.5C10.5004 13.1863 13.1867 10.5 16.5003 10.5ZM16.1192 1.5C19.2258 1.5 21.7442 4.0184 21.7442 7.125V7.86842C21.7442 8.48973 21.2405 8.99342 20.6192 8.99342C19.9979 8.99342 19.4942 8.48973 19.4942 7.86842V7.125C19.4942 5.26104 17.9831 3.75 16.1192 3.75H7.11913C5.25517 3.75 3.74413 5.26104 3.74413 7.125V16.4557C3.74413 18.3196 5.25517 19.8307 7.11913 19.8307H9.07888C9.70021 19.8307 10.2039 20.3343 10.2039 20.9557C10.2039 21.5771 9.70021 22.0807 9.07888 22.0807H7.11913C4.01254 22.0807 1.49414 19.5623 1.49414 16.4557V7.125C1.49414 4.0184 4.01254 1.5 7.11913 1.5H16.1192ZM16.5003 12.3823L16.3478 12.3926C15.8486 12.4603 15.4533 12.8555 15.3857 13.3547L15.3753 13.5073V15.3764L13.5016 15.375L13.3489 15.385C12.8496 15.4522 12.4541 15.847 12.3858 16.3461L12.3754 16.4988L12.3855 16.6515C12.4527 17.1507 12.8474 17.5463 13.3465 17.6145L13.4992 17.625L15.3753 17.6264V19.5054L15.3857 19.6581C15.4533 20.1573 15.8486 20.5524 16.3478 20.6202L16.5003 20.6304L16.653 20.6202C17.1522 20.5524 17.5473 20.1573 17.6151 19.6581L17.6253 19.5054V17.6294L19.4991 17.6313L19.6518 17.6213C20.1512 17.5541 20.5467 17.1593 20.615 16.6602L20.6253 16.5075L20.6153 16.355C20.5481 15.8556 20.1533 15.46 19.6542 15.3918L19.5015 15.3813L17.6253 15.3794V13.5073L17.6151 13.3547C17.5473 12.8555 17.1522 12.4603 16.653 12.3926L16.5003 12.3823Z"
          fill="black"
        />
      </svg>
      <div className="flex items-end justify-center w-fit text-xs tracking-[0] leading-5 whitespace-nowrap">
        <span className="font-bold underline ">Click here </span>
        <span className=" pl-1 font-medium ">
          {" "}
          to browse your library or drag and drop
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      <Label htmlFor={id}>{effectiveLabel}</Label>

      <div
        id={id}
        className={cn(
          "w-full rounded-xl border border-secondary cursor-pointer",
          "h-14 flex items-center px-3 py-4",
          "border-dashed",
          !selectedFile && " bg-white hover:border-secondary",
          selectedFile && "  cursor-default ",
          isDragging ? "border-blue-500 bg-blue-50/50" : ""
        )}
        onClick={handleWrapperClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {promptContent}
      </div>
    </div>
  );
};

type Document = {
  id: number;
  type: string;
  file: File | null;
  isFixed: boolean;
};

type DocumentUploadSectionProps = {
  doc: Document;
  onTypeChange: (id: number, type: string) => void;
  onFileChange: (id: number, file: File | null) => void;
  onRemove?: (id: number) => void;
  headerLabel: string;
  availableDocs: string[];
};

const DocumentUploadSection = ({
  doc,
  onTypeChange,
  onFileChange,
  onRemove,
  headerLabel,
  availableDocs,
}: DocumentUploadSectionProps) => {
  return (
    <div>
      {headerLabel && (
        <div className="flex justify-between">
          <div className="relative -top-0 py-4 self-stretch justify-start text-sm font-bold uppercase tracking-wider">
            {headerLabel}
          </div>
          {onRemove && (
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex justify-center items-center cursor-pointer gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.59159 4.5718V10.0252C3.59159 10.2804 3.69556 10.5261 3.87513 10.7057C4.0547 10.8853 4.30044 10.9892 4.55562 10.9892H8.4023C8.65748 10.9892 8.90321 10.8853 9.08279 10.7057C9.26236 10.5261 9.36633 10.2804 9.36633 10.0252V4.5718H3.59159ZM5.18886 5.85717V9.70384C5.18886 9.88342 5.33063 10.0252 5.5102 10.0252C5.68978 10.0252 5.83155 9.88342 5.83155 9.70384V5.85717C5.83155 5.6776 5.68978 5.53583 5.5102 5.53583C5.33063 5.53583 5.18886 5.6776 5.18886 5.85717ZM7.11692 5.85717V9.70384C7.11692 9.88342 7.25869 10.0252 7.43826 10.0252C7.61784 10.0252 7.75961 9.88342 7.75961 9.70384V5.85717C7.75961 5.6776 7.61784 5.53583 7.43826 5.53583C7.25869 5.53583 7.11692 5.6776 7.11692 5.85717ZM4.86752 3.29587H3.2608C3.08122 3.29587 2.93945 3.43764 2.93945 3.61722C2.93945 3.79679 3.08122 3.93856 3.2608 3.93856H9.67822C9.85779 3.93856 9.99956 3.79679 9.99956 3.61722C9.99956 3.43764 9.85779 3.29587 9.67822 3.29587H8.08095V2.97453C8.08095 2.44526 7.64619 2.0105 7.11692 2.0105H5.83155C5.30227 2.0105 4.86752 2.44526 4.86752 2.97453V3.29587ZM7.43826 2.97453V3.29587H5.5102V2.97453C5.5102 2.79495 5.65197 2.65319 5.83155 2.65319H7.11692C7.2965 2.65319 7.43826 2.79495 7.43826 2.97453Z"
                        fill="#F23E57"
                      />
                    </svg>
                    <button className="text-xs p-0 font-semibold cursor-pointer text-red-500">
                      Remove
                    </button>
                  </div>
                </DialogTrigger>

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
                          Are you sure that you want to delete the attached
                          document?
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
                            onClick={() => onRemove(doc.id)}
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
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="relative w-full">
          <Label htmlFor={`doc-type-${doc.id}`}>DOCUMENT TYPE</Label>

          <Select
            value={doc.type}
            onValueChange={(value) => onTypeChange(doc.id, value)}
          >
            <SelectTrigger
              id={`doc-type-${doc.id}`}
              className="rounded-xl text-secondary data-[state=open]:text-black data-[placeholder]:text-secondary"
            >
              <SelectValue placeholder="Choose Document Type" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-border">
              <SelectGroup>
                <SelectLabel className="sr-only">Document Types</SelectLabel>
                {availableDocs.map((docType) => (
                  <SelectItem
                    key={docType}
                    value={docType}
                    className="cursor-pointer text-base font-semibold focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primary",
                          doc.type === docType ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {docType}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <FloatingLabelFileUploader
          label="UPLOAD DOCUMENT"
          id={`upload-${doc.id}`}
          dynamicLabel={doc.type}
          onFileSelect={(file) => onFileChange(doc.id, file)}
          selectedFile={doc.file}
        />
      </div>
      <div className="pt-1 pl-3 text-secondary font-roobert text-xs font-normal leading-none">
        Files Supported: PDF, JPG, JPEG, PNG
      </div>
    </div>
  );
};

const KycSetup = (): JSX.Element => {
  const { token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !token) {
      toast.error("Please log in to continue");
      navigate("/login");
    }
  }, [authLoading, token, navigate]);

  const [documents, setDocuments] = useState<Document[]>([
    { id: 0, type: "", file: null, isFixed: true },
  ]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/login");

  const addDocument = () => {
    setDocuments((prev) => [
      ...prev,
      { id: prev.length, type: "", file: null, isFixed: false },
    ]);
  };

  const removeDocument = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast.success("Document section removed");
  };

  const handleTypeChange = (id: number, type: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, type } : doc))
    );
  };

  const handleFileChange = (id: number, file: File | null) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, file } : doc))
    );
    if (!file) {
    
      toast.info("File selection cleared");
    }
  };

  const hasPan = documents.some(
    (doc) => doc.type === "PAN Card" && doc.file
  );
  const hasAadhaar = documents.some(
    (doc) => doc.type === "Aadhaar Card" && doc.file
  );
  const isSaveEnabled = hasPan && hasAadhaar;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'loan_preset');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dd55izwf2/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    if (!isSaveEnabled) {
      toast.error("Please upload both PAN Card and Aadhaar Card");
      return;
    }

    setIsLoading(true);
    try {
      const validDocs = documents.filter((doc) => doc.type && doc.file);

      // Upload each file to Cloudinary
      const uploadedUrls = await Promise.all(
        validDocs.map(async (doc) => {
          const fileUrl = await uploadToCloudinary(doc.file!);
          return { docType: doc.type, fileUrl };
        })
      );

      // Save to MongoDB
      for (const uploadedDoc of uploadedUrls) {
        console.log("Uploading KYC document to backend:", uploadedDoc);
        const response = await apiService.uploadKyc(uploadedDoc);
        console.log("KYC upload successful:", response);
      }

      toast.success("KYC documents uploaded successfully");
      const redirectTo = "/login";
      setRedirectPath(redirectTo);

      if (redirectTo === "/login") {
        localStorage.removeItem("authToken");
      }

      setSuccessModalOpen(true);
    } catch (error: any) {
      console.error("KYC upload failed:", error);
      if (
        error.message?.includes("Unauthorized") ||
        error.message?.includes("Access denied") ||
        error.message?.includes("token")
      ) {
        toast.error("Session expired, please log in again");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        toast.error(error.message || "Failed to upload KYC documents. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDocs = (currentId: number, currentType: string) => {
    const otherTypes = documents
      .filter((d) => d.id !== currentId && d.type)
      .map((d) => d.type);
    const available = docs.filter((d) => !otherTypes.includes(d) || d === currentType);
    return available;
  };

  return (
    <div className="p-16 flex justify-center font-inter items-center bg-white">
      <Card className="w-full max-w-xl px-14">
        <CardHeader>
          <div className="flex flex-col items-center">
            <div className="font-bold text-black text-[32px] text-center tracking-[-2px]">
              Upload KYC Documents
            </div>

            <div className="text-center text-secondary text-base font-normal">
              Verify your identity to proceed with loan applications. All
              uploads are secure and encrypted
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative -top-4 font-roobert pt-3 self-stretch justify-start text-sm font-bold uppercase tracking-wider">
            DOCUMENTS
          </div>

          {documents.map((doc, index) => (
            <DocumentUploadSection
              key={doc.id}
              doc={doc}
              onTypeChange={handleTypeChange}
              onFileChange={handleFileChange}
              onRemove={index === 0 ? undefined : removeDocument}
              headerLabel={index === 0 ? "" : "ADDITIONAL DOCUMENTS"}
              availableDocs={getAvailableDocs(doc.id, doc.type)}
            />
          ))}

          <div className="flex justify-end py-3 px-2 items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="9"
              viewBox="0 0 10 9"
              fill="none"
            >
              <path
                d="M5 0C4.73131 0 4.51351 0.217812 4.51351 0.486486V4.01353H0.986486C0.717812 4.01353 0.5 4.23133 0.5 4.50001C0.5 4.7687 0.717812 4.9865 0.986486 4.9865H4.51351V8.51351C4.51351 8.78219 4.73131 9 5 9C5.26869 9 5.48649 8.78219 5.48649 8.51351V4.9865H9.01351C9.28219 4.9865 9.5 4.7687 9.5 4.50001C9.5 4.23133 9.28219 4.01353 9.01351 4.01353H5.48649V0.486486C5.48649 0.217812 5.26869 0 5 0Z"
                fill="black"
              />
            </svg>
            <button
              type="button"
              onClick={addDocument}
              className="text-xs cursor-pointer font-semibold text-black"
            >
              Add More Documents
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            size="lg"
            variant="default"
            disabled={!isSaveEnabled || isLoading}
            className="w-full"
            onClick={handleSave}
          >
            {isLoading ? <Spinner /> : "Save"}
          </Button>

          {successModalOpen && (
            <SuccessModal
              open={successModalOpen}
              onOpenChange={setSuccessModalOpen}
              redirectPath={redirectPath}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default KycSetup;