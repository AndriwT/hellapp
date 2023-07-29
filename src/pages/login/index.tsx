import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const login = () => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
        window.location.href = "/home";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert("LOGIN ERROR: " + errorMessage + "ERROR CODE: " + errorCode);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1>Log into Account</h1>
      <div className="flex flex-col justify-center items-center mt-10 w-60">
        <input
          className="flex justify-center rounded-md shadow-md p-2 mt-4"
          value={email}
          type="email"
          placeholder="Email..."
          onChange={handleEmailChange}
        />
        <input
          className="flex justify-center rounded-md shadow-md p-2 mt-4"
          value={password}
          type="password"
          placeholder="Password..."
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="mt-2 bg-lime-500 text-white rounded-md shadow-md p-4 w-48"
          onClick={login}
        >
          Login
        </button>
        <Link
          className="mt-2 bg-lime-300 text-white text-center rounded-md shadow-md p-4 w-48"
          href="/register"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
