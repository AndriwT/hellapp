import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Head from "next/head";
import React, { ChangeEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
      <h1>Log In</h1>
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
        />
        <button
          className="mt-2 bg-lime-500 text-white rounded-md shadow-md p-4 w-48"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}
