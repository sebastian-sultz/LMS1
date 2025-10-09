import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Check, ChevronsDown } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

const states = [
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
]

const SetupProfile = (): JSX.Element => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")


  return (
    <div className="p-16 flex justify-center font-roobert items-center bg-white">
      <Card className="w-full max-w-xl px-14 ">
        {/* ===== Header ===== */}
        <CardHeader>
          <div className="flex flex-col items-center">
            <div className="font-roobert font-bold text-black text-[32px] text-center tracking-[-2px]">
              Setup your profile
            </div>

            <div className="text-center text-secondary text-base font-inter">
              <span className="font-roobert font-normal">
                Keep your details up to date for faster loan approvals.
              </span>
            </div>
          </div>
        </CardHeader>

        {/* ===== Form ===== */}
        <CardContent>
          <form className="flex flex-col gap-6">
            {/* Full Name */}
            <div className="relative">
              <Label
                htmlFor="fullName"
                className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter Full Name"
                required
              />
            </div>

            {/* Date of Birth (using Button + Popover) */}
            <div className="relative">
              <Label
                htmlFor="dob"
                className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary z-10"
              >
                Date of Birth
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dob"
                    variant="outline"
                    size="default"
                    type="button"
                    className={cn(
                      "w-full justify-between rounded-xl border border-[#D8DEE4] text-left font-semibold text-base py-7 h-9",
                      !date && "text-[#858699]"
                    )}
                  >
                    {date ? format(date, "dd-MM-yyyy") : "DD-MM-YYYY"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="opacity-70 h-7 w-7" // <-- change h-5 w-5 to any size (e.g. h-4 w-4 or h-6 w-6)
                    >
                      {" "}
                      <path
                        d="M16.7502 3.56V2C16.7502 1.59 16.4102 1.25 16.0002 1.25C15.5902 1.25 15.2502 1.59 15.2502 2V3.5H8.75023V2C8.75023 1.59 8.41023 1.25 8.00023 1.25C7.59023 1.25 7.25023 1.59 7.25023 2V3.56C4.55023 3.81 3.24023 5.42 3.04023 7.81C3.02023 8.1 3.26023 8.34 3.54023 8.34H20.4602C20.7502 8.34 20.9902 8.09 20.9602 7.81C20.7602 5.42 19.4502 3.81 16.7502 3.56Z"
                        fill="#929292"
                      />
                      <path
                        d="M20 9.83984H4C3.45 9.83984 3 10.2898 3 10.8398V16.9998C3 19.9998 4.5 21.9998 8 21.9998H16C19.5 21.9998 21 19.9998 21 16.9998V10.8398C21 10.2898 20.55 9.83984 20 9.83984ZM9.21 18.2098C9.16 18.2498 9.11 18.2998 9.06 18.3298C9 18.3698 8.94 18.3998 8.88 18.4198C8.82 18.4498 8.76 18.4698 8.7 18.4798C8.63 18.4898 8.57 18.4998 8.5 18.4998C8.37 18.4998 8.24 18.4698 8.12 18.4198C7.99 18.3698 7.89 18.2998 7.79 18.2098C7.61 18.0198 7.5 17.7598 7.5 17.4998C7.5 17.2398 7.61 16.9798 7.79 16.7898C7.89 16.6998 7.99 16.6298 8.12 16.5798C8.3 16.4998 8.5 16.4798 8.7 16.5198C8.76 16.5298 8.82 16.5498 8.88 16.5798C8.94 16.5998 9 16.6298 9.06 16.6698C9.11 16.7098 9.16 16.7498 9.21 16.7898C9.39 16.9798 9.5 17.2398 9.5 17.4998C9.5 17.7598 9.39 18.0198 9.21 18.2098ZM9.21 14.7098C9.02 14.8898 8.76 14.9998 8.5 14.9998C8.24 14.9998 7.98 14.8898 7.79 14.7098C7.61 14.5198 7.5 14.2598 7.5 13.9998C7.5 13.7398 7.61 13.4798 7.79 13.2898C8.07 13.0098 8.51 12.9198 8.88 13.0798C9.01 13.1298 9.12 13.1998 9.21 13.2898C9.39 13.4798 9.5 13.7398 9.5 13.9998C9.5 14.2598 9.39 14.5198 9.21 14.7098ZM12.71 18.2098C12.52 18.3898 12.26 18.4998 12 18.4998C11.74 18.4998 11.48 18.3898 11.29 18.2098C11.11 18.0198 11 17.7598 11 17.4998C11 17.2398 11.11 16.9798 11.29 16.7898C11.66 16.4198 12.34 16.4198 12.71 16.7898C12.89 16.9798 13 17.2398 13 17.4998C13 17.7598 12.89 18.0198 12.71 18.2098ZM12.71 14.7098C12.66 14.7498 12.61 14.7898 12.56 14.8298C12.5 14.8698 12.44 14.8998 12.38 14.9198C12.32 14.9498 12.26 14.9698 12.2 14.9798C12.13 14.9898 12.07 14.9998 12 14.9998C11.74 14.9998 11.48 14.8898 11.29 14.7098C11.11 14.5198 11 14.2598 11 13.9998C11 13.7398 11.11 13.4798 11.29 13.2898C11.38 13.1998 11.49 13.1298 11.62 13.0798C11.99 12.9198 12.43 13.0098 12.71 13.2898C12.89 13.4798 13 13.7398 13 13.9998C13 14.2598 12.89 14.5198 12.71 14.7098ZM16.21 18.2098C16.02 18.3898 15.76 18.4998 15.5 18.4998C15.24 18.4998 14.98 18.3898 14.79 18.2098C14.61 18.0198 14.5 17.7598 14.5 17.4998C14.5 17.2398 14.61 16.9798 14.79 16.7898C15.16 16.4198 15.84 16.4198 16.21 16.7898C16.39 16.9798 16.5 17.2398 16.5 17.4998C16.5 17.7598 16.39 18.0198 16.21 18.2098ZM16.21 14.7098C16.16 14.7498 16.11 14.7898 16.06 14.8298C16 14.8698 15.94 14.8998 15.88 14.9198C15.82 14.9498 15.76 14.9698 15.7 14.9798C15.63 14.9898 15.56 14.9998 15.5 14.9998C15.24 14.9998 14.98 14.8898 14.79 14.7098C14.61 14.5198 14.5 14.2598 14.5 13.9998C14.5 13.7398 14.61 13.4798 14.79 13.2898C14.89 13.1998 14.99 13.1298 15.12 13.0798C15.3 12.9998 15.5 12.9798 15.7 13.0198C15.76 13.0298 15.82 13.0498 15.88 13.0798C15.94 13.0998 16 13.1298 16.06 13.1698L16.21 13.2898C16.39 13.4798 16.5 13.7398 16.5 13.9998C16.5 14.2598 16.39 14.5198 16.21 14.7098Z"
                        fill="#929292"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>

                {/* ✅ Ensures white background inside Popover */}
                <PopoverContent
                  className="w-auto p-0 bg-white border border-[#E5E7EB] shadow-md rounded-xl"
                  align="start"
                >
                  <div className="bg-white rounded-xl">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="bg-white"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Address */}
            <div className="relative">
              <Label
                htmlFor="address"
                className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary"
              >
                Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter Address"
                required
              />
            </div>

            {/* City */}
            <div className="relative">
              <Label
                htmlFor="city"
                className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary"
              >
                City
              </Label>
              <Input id="city" type="text" placeholder="Enter City" required />
            </div>

            {/* State */}
           <div className="relative w-full">
      {/* Floating Label */}
      <Label
        htmlFor="state"
        className="absolute -top-2 left-3 bg-white px-1 text-xs text-secondary"
      >
        State
      </Label>

      {/* Popover Trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="state"
            variant="outline"
            size="default"
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              // ✅ Matching your Input styles exactly
              "file:text-foreground placeholder:text-[#858699] placeholder:font-semibold selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-xl border border-[#D8DEE4] bg-transparent px-3 py-7 text-base font-semibold shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "flex items-center justify-between text-left",
              !value && "text-[#858699]"
            )}
          >
            {/* Display Value */}
            {value ? value : "Choose State"}

            {/* Custom Dropdown Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="12"
              viewBox="0 0 21 12"
              fill="none"
              className="ml-2 shrink-0"
            >
              <path
                d="M11.3695 10.9044L19.9192 2.31262C20.1413 2.08267 20.2641 1.77469 20.2614 1.455C20.2586 1.13532 20.1304 0.82952 19.9043 0.603461C19.6782 0.377403 19.3724 0.249177 19.0528 0.246399C18.7331 0.243621 18.4251 0.366514 18.1951 0.588609L10.5074 8.31837L2.84972 0.618574C2.73724 0.502124 2.60271 0.409238 2.45395 0.345339C2.3052 0.281439 2.14521 0.247805 1.98332 0.246398C1.82143 0.244991 1.66088 0.275841 1.51104 0.337146C1.3612 0.398451 1.22507 0.488984 1.11059 0.603462C0.996111 0.71794 0.905577 0.854071 0.844273 1.00391C0.782968 1.15375 0.752119 1.3143 0.753527 1.47619C0.754934 1.63808 0.788568 1.79807 0.852468 1.94683C0.916368 2.09558 1.00925 2.23012 1.1257 2.34259L9.64544 10.9044C9.87408 11.133 10.1841 11.2614 10.5074 11.2614C10.8307 11.2614 11.1408 11.133 11.3695 10.9044Z"
                fill="#929292"
              />
            </svg>
          </Button>
        </PopoverTrigger>

        {/* Popover Content (same width as trigger) */}
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white rounded-xl shadow-lg border border-[#E2E8F0]"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search state..." className="text-sm" />
            <CommandGroup>
              {states.map((state) => (
                <CommandItem
                  key={state}
                  value={state}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    setOpen(false)
                  }}
                  className="cursor-pointer text-base font-semibold"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      value === state ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {state}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
          </form>
        </CardContent>

        {/* ===== Footer ===== */}
        <CardFooter className="flex-col gap-2">
          <Button type="submit" size="lg" className="w-full">
            Save
          </Button>
         
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupProfile;
