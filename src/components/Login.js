import Header from "./Header"
import {useState,useRef} from "react"
import { checkValidData } from "../utiles/validate"
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword,updateProfile} from "firebase/auth";
import {auth} from "../utiles/fireBase";
import { useDispatch } from "react-redux";
import { addUser } from "../utiles/userSlice";
import { LOGIN_BG,URL_LOGIN } from "../utiles/constants";
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
        <div>
             <Header/> 
             <div className="absolute">
                 <img className="h-screen  object-cover w-screen " src={LOGIN_BG} alt="logo" />
             </div>
             <div className=" top-28 text-xl relative z-10  h-10  m-auto w-6/12 md:w-3/12 font-bold justify-center bg-black opacity-80 ">
                <h1 className="text-red-500 justify-center text-center ">Welcome Back</h1>
             </div>
             {/* signIn and signup form */}
             <form onSubmit={(e)=>e.preventDefault()}className="h-[50%]  md:h-[72%] w-full md:w-3/12 absolute bg-black p-12 mx-auto left-0 right-0 my-36 text-white bg-opacity-80 rounded-lg">
                 <h1 className="font-bold text-lg md:text-3xl relative -top-10 md:relative md:py-4">{isSignInForm?"Sign In":"Sign Up"}</h1>
                 {!isSignInForm&&<input ref={name} type="text" placeholder="Full name" className="relative -top-8 md:-top-4 md:relative p-1.5 md:p-3 my-1 md:my-2 w-full bg-gray-700 rounded-lg "/>}
                 <input ref={email} type="text" placeholder="Email Address" className=" relative -top-7 md:-top-5 md:relative p-1.5 md:p-3 my-1 md:my-1 w-full bg-gray-700 rounded-lg "/>
                 <input ref={password} type="password" placeholder="Password" className="relative -top-5 md:-top-5 md:relative p-1.5 md:p-3 my-1 md:my-1 w-full rounded-lg bg-gray-700 "></input>
                 <p className="text-center text-red-600 font-bold text-lg py-2">{errorMessage}</p>
                 <button className="relative -top-3 md:-top-4 md:relative p-1.5 md:p-3 my-0 md:my-1 bg-red-600 w-full rounded-lg hover:bg-red-800" onClick={handleButtonClick}>{isSignInForm?"Sign In":"Sign Up"}</button>
                 <p className=" relative -top-4 md:-top-5 text-sm md:text-lg py-4 cursor-pointer"onClick={toggleSignInForm}>{isSignInForm?"Is you New for Netflix click on ? Sign Up Now":"Already Registered ?Sign In Now"}</p>
             </form>
        </div>
    );
}
export default Login;