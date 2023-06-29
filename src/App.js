import { useEffect ,useState} from 'react';
import { auth , firebase } from './components/firebase';
import { BrowserRouter as Router,Route ,Routes} from "react-router-dom";
import BasicForm from './components/SignIn/basicForm';
import Dash from "./components/Dashboard/Dashboard"
import PatientManagement from './components/Patient/patient';
import RecordList from "./components/MedicalRecords/RecordList";
import PharmacyRegistration from "./components/Pharmacy/Pharmacy";

function App() {
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [ver,setVer] = useState(false);
  
  const loginSubmit = (e) => {
    e.preventDefault();

    let phone_number = e.target.phone.value;
    const appVerifier = window.recaptchaVerifier;

    auth
        .signInWithPhoneNumber(phone_number, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            console.log("otp sent");
            setViewOtpForm(true);
            window.confirmationResult = confirmationResult;
            alert("OTP sent✅")
            // ...
        })
        .catch((error) => {
            // Error; SMS not sent
            // ...
            alert(error.message);
        });
};
const otpSubmit = (e) => {
  e.preventDefault();

  let opt_number = e.target.otp_value.value;

  window.confirmationResult
      .confirm(opt_number)
      .then((confirmationResult) => {
          console.log(confirmationResult);
          console.log("success");
          window.open("/Dashboard","_self"); 
      })
      .catch((error) => {
          // User couldn't sign in (bad verification code?)
          alert(error.message);
          
      });
};

const signOut = () => {
    auth
    .signOut()
    .then(() => {
        window.open("/", "_self");
    })
    .catch((error) => {
        // An error happened.
        console.log(error);
    });
};

const [user, setUser] = useState([]);
auth.onAuthStateChanged((user) => {
  if (user) {
      setUser(user);
      
  }
});
  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container", {
            size: "invisible",
            callback: function(response) {
                console.log("Captcha Resolved");
            },
            defaultCountry: "IN",
        }
    );
}, []);
    


return (
        // <div>
        //   <div id="recaptcha-container"></div>
        //   <BasicForm loginSubmit={loginSubmit} otpSubmit = {otpSubmit} viewOtpForm={viewOtpForm}/>
        // </div>
    <Router>
    <div id="recaptcha-container"></div>
    <Routes>
        <Route path="/" 
            element ={<BasicForm loginSubmit={loginSubmit} otpSubmit = {otpSubmit} viewOtpForm={viewOtpForm} ver={ver}/>}>
        </Route>
        <Route path="/Dashboard" element ={<Dash signOut={signOut} user={user}/>}></Route>
        <Route path = "/Dashboard/Patient" element={<PatientManagement/>}></Route>
        {/* <Route path = "/Dashboard/Staff" element={<Dashboard/>}></Route> */}
        <Route path='/Dashboard/emr' element={<RecordList />}></Route>
        <Route path='/Dashboard/pharmacy' element={<PharmacyRegistration/>}></Route>
        <Route path="*" element={<h2>Page Not Found</h2>}></Route>
    </Routes>
</Router>
    );
}

export default App;
