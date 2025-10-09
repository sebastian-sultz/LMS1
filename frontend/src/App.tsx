import { Route, Routes } from "react-router";
import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { SMobileNo } from "./components/SMobileNo";
import { SOTP } from "./components/SOTP";
import SetupProfile from "./components/SetupProfile";
import KycSetup from "./components/KycSetup";
function App() {
  return (
    <>
    
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupM" element={<SMobileNo />} />
          <Route path="/sotp" element={<SOTP/>}/>
          <Route path="/profileSetup" element={<SetupProfile/>}/>
          <Route path="/kycSetup" element={<KycSetup/>}/>

        </Routes>
      
    
    </>
  );
}

export default App;
