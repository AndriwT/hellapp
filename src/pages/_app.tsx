import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { firestore } from "firebase-admin";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Yf8Fp5Bq1YgFgYW0Hkq_LDK-2R3G_P4",
  authDomain: "hellapp-ba916.firebaseapp.com",
  projectId: "hellapp-ba916",
  storageBucket: "hellapp-ba916.appspot.com",
  messagingSenderId: "1022363938402",
  appId: "1:1022363938402:web:5e22d11334ace69c60ab3b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return null;

  return <Component {...pageProps} user={user} />;
}
