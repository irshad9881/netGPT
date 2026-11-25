import Header from "./Header"
import {useState,useRef} from "react"
import { checkValidData } from "../utiles/validate"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utiles/userSlice";
import { LOGIN_BG } from "../utiles/constants";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  resendVerificationCode,
  requestPasswordReset,
  resetPasswordWithCode,
  verifyEmail,
} from "../utiles/auth-api";
import { toStoreUser } from "../utiles/to-store-user";
import GoogleSignInButton from "./GoogleSignInButton";

const fieldClass =
  "w-full h-12 rounded bg-[#333] px-4 text-[16px] text-white placeholder:text-zinc-400 outline-none transition focus:bg-[#404040] focus:ring-2 focus:ring-[#E50914]";

const Login=()=>{
  const [errorMessage,setErrorMessage]=useState('');
  const [infoMessage,setInfoMessage]=useState('');
  const [screen,setScreen]=useState("signup");
  const email=useRef(null);
  const password=useRef(null);
  const name=useRef(null);
  const code=useRef(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const goTo=(nextScreen)=>{
      setScreen(nextScreen);
      setErrorMessage('');
      setInfoMessage('');
  }

  const handleButtonClick = async () => {
    setErrorMessage('');
    const emailValue = email.current?.value || "";

    try {
      if (screen === "verify") {
        const { user } = await verifyEmail(emailValue, code.current.value);
        dispatch(addUser(toStoreUser(user)));
        navigate("/browse");
        return;
      }

      if (screen === "forgot") {
        const result = await requestPasswordReset(emailValue);
        const notice = result.message || "If that email exists, we sent a code";
        setScreen("reset");
        setErrorMessage("");
        setInfoMessage(notice);
        return;
      }

      if (screen === "reset") {
        const passwordValue = password.current.value;
        const message = checkValidData(emailValue, passwordValue);
        setErrorMessage(message);
        if (message) return;
        const result = await resetPasswordWithCode(
          emailValue,
          code.current.value,
          passwordValue
        );
        setScreen("signin");
        setErrorMessage("");
        setInfoMessage(result.message || "Password updated. Sign in");
        return;
      }

      const message = checkValidData(emailValue, password.current.value);
      setErrorMessage(message);
      if (message) return;

      if (screen === "signup") {
        const fullName = name.current?.value?.trim();
        if (!fullName || fullName.length < 2) {
          setErrorMessage("Enter your full name");
          return;
        }
        const result = await registerWithEmail(
          fullName,
          emailValue,
          password.current.value
        );
        setInfoMessage(result.message || "Check your email for a 6-digit code");
        setScreen("verify");
        return;
      }

      const { user } = await loginWithEmail(emailValue, password.current.value);
      dispatch(addUser(toStoreUser(user)));
      navigate("/browse");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleResendCode = async () => {
    setErrorMessage("");
    try {
      const result = await resendVerificationCode(email.current?.value || "");
      setInfoMessage(result.message || "If that account needs verification, we sent a code");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleCredential = async (idToken) => {
    setErrorMessage("");
    try {
      const { user } = await loginWithGoogle(idToken);
      dispatch(addUser(toStoreUser(user)));
      navigate("/browse");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const title = {
    signup: "Create account",
    signin: "Sign in",
    verify: "Check your email",
    forgot: "Forgot password",
    reset: "Set a new password",
  }[screen];

  const subtitle = {
    signup: "Use a real email. We send a 6-digit code to verify it.",
    signin: "Welcome back. Sign in to keep watching.",
    verify: "Enter the 6-digit code we sent. It expires in 10 minutes.",
    forgot: "Enter your email and we will send a reset code.",
    reset: "Use the code from your inbox and choose a new password.",
  }[screen];

  const buttonLabel = {
    signup: "Get started",
    signin: "Sign in",
    verify: "Verify and continue",
    forgot: "Send reset code",
    reset: "Update password",
  }[screen];

  return (
        <div className="relative min-h-screen bg-black text-white">
             <Header/>
             <div className="absolute inset-0">
                 <img className="h-full w-full scale-105 object-cover object-center" src={LOGIN_BG} alt="" />
                 <div className="absolute inset-0 bg-black/25" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
             </div>
             <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:py-28">
             <form onSubmit={(e)=>e.preventDefault()} className="w-full max-w-[450px] rounded-md border border-white/10 bg-black/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-md sm:p-12">
                 <h1 className="text-3xl font-bold tracking-tight sm:text-[2rem]">{title}</h1>
                 <p className="mt-2 mb-7 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
                 <div className="flex flex-col gap-3">
                 {screen==="signup"&&<input ref={name} type="text" autoComplete="name" placeholder="Full name" className={fieldClass}/>}
                 <input ref={email} type="email" autoComplete="email" placeholder="Email address" className={fieldClass}/>
                 {(screen==="signup"||screen==="signin"||screen==="reset")&&<input ref={password} type="password" autoComplete={screen==="signin"?"current-password":"new-password"} placeholder={screen==="reset"?"New password (8+ characters)":"Password"} className={fieldClass}/>}
                 {(screen==="verify"||screen==="reset")&&<input ref={code} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" className={`${fieldClass} tracking-[0.35em] text-center`}/>}
                 </div>
                 {infoMessage && <p className="mt-3 text-sm font-medium text-emerald-400">{infoMessage}</p>}
                 {errorMessage && <p className="mt-3 text-sm font-medium text-red-500">{errorMessage}</p>}
                 <button type="button" className="mt-6 h-12 w-full rounded bg-[#E50914] text-base font-semibold transition hover:bg-[#f6121d]" onClick={handleButtonClick}>{buttonLabel}</button>
                 {screen==="verify"&&(
                   <button type="button" className="mt-3 w-full text-center text-sm text-zinc-400 hover:text-white hover:underline" onClick={handleResendCode}>
                     Resend code
                   </button>
                 )}
                 {screen==="signin"&&(
                   <button type="button" className="mt-3 w-full text-left text-sm text-zinc-400 hover:underline" onClick={()=>goTo("forgot")}>
                     Forgot password?
                   </button>
                 )}
                 {(screen==="signup"||screen==="signin")&&(
                   <>
                     <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-zinc-500">
                       <span className="h-px flex-1 bg-zinc-700" />
                       or
                       <span className="h-px flex-1 bg-zinc-700" />
                     </div>
                     <GoogleSignInButton
                       onCredential={handleGoogleCredential}
                       onError={(error)=>setErrorMessage(error.message)}
                     />
                   </>
                 )}
                 <p className="mt-8 text-sm text-zinc-400">
                 {screen==="forgot"||screen==="reset"?
                   <button type="button" className="text-white hover:underline" onClick={()=>goTo("signin")}>Back to sign in</button>
                   :
                   screen==="signin"
                     ? <>New to Netfilix-AI? <button type="button" className="font-medium text-white hover:underline" onClick={()=>goTo("signup")}>Sign up now</button></>
                     : <>Already have an account? <button type="button" className="font-medium text-white hover:underline" onClick={()=>goTo("signin")}>Sign in</button></>
                 }
                 </p>
                 <p className="mt-6 text-[11px] leading-relaxed text-zinc-500">Portfolio project. Not affiliated with Netflix. Use a test email, not your Netflix password.</p>
             </form>
             </main>
        </div>
    );
}
export default Login;
