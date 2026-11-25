import { useEffect, useRef } from "react";

const GIS_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const loadGoogleIdentity = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const fail = () => reject(new Error("Google Sign-In failed to load"));
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", fail, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = fail;
    document.head.appendChild(script);
  });

const GoogleSignInButton = ({ onCredential, onError }) => {
  const buttonRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return undefined;
    let cancelled = false;

    loadGoogleIdentity()
      .then(() => {
        if (cancelled || !buttonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              onCredentialRef.current(response.credential);
              return;
            }
            onErrorRef.current?.(new Error("Google sign-in was cancelled"));
          },
        });
        buttonRef.current.innerHTML = "";
        const width = Math.max(
          240,
          Math.min(buttonRef.current.parentElement?.clientWidth || 320, 400)
        );
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      })
      .catch((error) => onErrorRef.current?.(error));

    return () => {
      cancelled = true;
    };
    // GIS button is rendered once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-center text-xs text-zinc-500">
        Google Sign-In needs REACT_APP_GOOGLE_CLIENT_ID (restart npm start after adding it).
      </p>
    );
  }

  return (
    <div className="flex w-full min-h-[40px] justify-center overflow-hidden rounded bg-white">
      <div className="w-full" ref={buttonRef} />
    </div>
  );
};

export default GoogleSignInButton;
