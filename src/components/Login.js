import Header from "./Header"
import {useState,useRef} from "react"
import { checkValidData } from "../utiles/validate"
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword,updateProfile} from "firebase/auth";
import {auth} from "../utiles/fireBase";
import { useDispatch } from "react-redux";
import { addUser } from "../utiles/userSlice";
import { LOGIN_BG, URL_LOGIN } from "../utiles/constants";
const Login=()=>{
  const [errorMessage,setErrorMessage]=useState('');
  const email=useRef(null);
  const password=useRef(null);
  const name=useRef(null);
  const dispatch=useDispatch();
  const [isSignInForm,setIsSignInForm]=useState(false);
  const toggleSignInForm=()=>{
      setIsSignInForm(!isSignInForm);
  }
  const handleButtonClick=()=>{
    //email and password validation or form validation
    const message = checkValidData(email.current.value,password.current.value );
    setErrorMessage(message);
    if(message) return;
    if(!isSignInForm)//signup 
    {
    createUserWithEmailAndPassword(auth, email.current.value,password.current.value )
      .then((userCredential) => {
              const user = userCredential.user;
              updateProfile(user, {
                                    displayName: name.current.value,
                                    photoURL: URL_LOGIN
              }).then(() =>{
                          //Profile updated! and store
                          const {uid,email,displayName,photoURL}= auth.currentUser;
                          dispatch(addUser({uid:uid,email:email,displayName:displayName,photoURL:photoURL}));
                      }).catch((error) =>{ 
                                    setErrorMessage(error.message);
                               });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode+"-"+errorMessage);
      });
    }
    else{ //signIn 
          signInWithEmailAndPassword(auth, email.current.value,password.current.value)
          .then((userCredential) => {
            const user = userCredential.user;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorMessage(errorCode+" "+errorMessage);
          });
    }
}  
    return (
        <div className="relative min-h-screen">
             <Header/> 
             <div className="absolute inset-0">
                 <img className="h-full w-full object-cover" src={LOGIN_BG} alt="" />
                 <div className="absolute inset-0 bg-black/60" />
             </div>
             <form onSubmit={(e)=>e.preventDefault()} className="relative z-10 w-11/12 max-w-md mx-auto mt-28 md:mt-36 bg-black/80 p-8 md:p-12 text-white rounded-md flex flex-col gap-4">
                 <h1 className="font-bold text-3xl">{isSignInForm?"Sign In":"Sign Up"}</h1>
                 {!isSignInForm&&<input ref={name} type="text" placeholder="Full name" className="p-3 w-full bg-zinc-800 rounded outline-none focus:ring-1 focus:ring-zinc-500"/>}
                 <input ref={email} type="text" placeholder="Email Address" className="p-3 w-full bg-zinc-800 rounded outline-none focus:ring-1 focus:ring-zinc-500"/>
                 <input ref={password} type="password" placeholder="Password" className="p-3 w-full bg-zinc-800 rounded outline-none focus:ring-1 focus:ring-zinc-500"/>
                 {errorMessage && <p className="text-red-500 font-semibold text-sm">{errorMessage}</p>}
                 <button className="p-3 bg-red-600 w-full rounded hover:bg-red-700 font-semibold" onClick={handleButtonClick}>{isSignInForm?"Sign In":"Sign Up"}</button>
                 <p className="text-zinc-400 cursor-pointer hover:underline" onClick={toggleSignInForm}>{isSignInForm?"New to NetGPT? Sign Up Now":"Already registered? Sign In Now"}</p>
                 <p className="text-[11px] text-zinc-500 leading-relaxed">Portfolio project. Not affiliated with Netflix. Use a test email, not your Netflix password.</p>
             </form>
        </div>
    );
}
export default Login;
