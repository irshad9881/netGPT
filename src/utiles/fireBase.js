// Firebase is kept but commented out so a missing API key does not crash the UI.
// Login and Header now use the cookie API. Uncomment this block to use Firebase again.

// import { initializeApp } from "firebase/app";
// import { getAuth, initializeAuth, browserLocalPersistence } from "firebase/auth";
//
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };
//
// const app = initializeApp(firebaseConfig);
//
// let auth;
// try {
//   auth = initializeAuth(app, {
//     persistence: browserLocalPersistence,
//   });
// } catch {
//   auth = getAuth(app);
// }
//
// export { auth };

export const auth = null;
