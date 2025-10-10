// import { Route, Routes } from "react-router";
// import "./App.css";
// import { Login } from "./components/Login";
// import { SignUp } from "./components/SignUp";
// import { SMobileNo } from "./components/SMobileNo";
// import { SOTP } from "./components/SOTP";
// import SetupProfile from "./components/SetupProfile";
// import KycSetup from "./components/KycSetup";
// import Dashboard from "./components/Dashboard/Dashboard";
// // import Dashboard from "./components/Dashboard";
// function App() {
//   return (
//     <>
    
//         <Routes>
//           <Route path="/" element={<Login/>}/>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/signupM" element={<SMobileNo />} />
//           <Route path="/sotp" element={<SOTP/>}/>
//           <Route path="/profileSetup" element={<SetupProfile/>}/>
//           <Route path="/kycSetup" element={<KycSetup/>}/>
//           <Route path="/dash" element={<Dashboard/>}/>

//         </Routes>
      
    
//     </>
//   );
// }

// export default App;


import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { SMobileNo } from "./components/SMobileNo";
import { SOTP } from "./components/SOTP";
import SetupProfile from "./components/SetupProfile";
import KycSetup from "./components/KycSetup";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <>
      {/* ✅ Navbar */}
      <nav className="w-full bg-[#001336] text-white py-3 px-6 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
        <h1 className="font-semibold text-lg">App Navigation</h1>

        <div className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">
            Login
          </Link>
          <Link to="/signup" className="hover:underline">
            SignUp
          </Link>
          <Link to="/signupM" className="hover:underline">
            SMobileNo
          </Link>
          <Link to="/sotp" className="hover:underline">
            SOTP
          </Link>
          <Link to="/profileSetup" className="hover:underline">
            SetupProfile
          </Link>
          <Link to="/kycSetup" className="hover:underline">
            KycSetup
          </Link>
          <Link to="/dash" className="hover:underline">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* ✅ Add top padding so content doesn’t hide behind navbar */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupM" element={<SMobileNo />} />
          <Route path="/sotp" element={<SOTP />} />
          <Route path="/profileSetup" element={<SetupProfile />} />
          <Route path="/kycSetup" element={<KycSetup />} />
          <Route path="/dash" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
