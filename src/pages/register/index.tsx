import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import uuid from "react-uuid";
import { app } from "../_app";

interface User {
  id: number;
  username: string;
  email: string;
}

const db = getFirestore(app);

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      signUp();
    }
  };

  async function signUp() {
    try {
      if (!username || !email || !password) {
        alert("All fields are required.");
        return;
      }

      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      console.log(user);

      await saveUser(username, email);
      window.location.href = "/home";
    } catch (error) {
      console.log("Error creating user: ", error);
      alert("Error creating user: " + error);
    }
  }

  async function saveUser(username: string, email: string) {
    try {
      const id = uuid();
      await setDoc(doc(db, "users", id), {
        id: id,
        username: username,
        email: email, // Use the email from the user object obtained during registration.
      });
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="text-[#005F73] text-4xl">Create an Account</h1>
      <div className="flex flex-col justify-center items-center mt-10 w-60">
        <input
          className="bg-[#F7F1DE] flex justify-center rounded-md shadow-md p-2 mt-4"
          value={username}
          type="text"
          placeholder="Username..."
          onChange={handleUsernameChange}
        />
        <input
          className="bg-[#F7F1DE] flex justify-center rounded-md shadow-md p-2 mt-2"
          value={email}
          type="email"
          placeholder="Email..."
          onChange={handleEmailChange}
        />
        <input
          className="bg-[#F7F1DE] flex justify-center rounded-md shadow-md p-2 mt-2"
          value={password}
          type="password"
          placeholder="Password..."
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="mt-4 bg-[#0A9396] text-[#F7F1DE] rounded-md shadow-md p-4 w-48"
          onClick={signUp}
        >
          Register
        </button>
        <Link
          className="mt-2 bg-[#F7F1DE] text-[#0A9396] text-center rounded-md shadow-md p-4 w-48"
          href="/login"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
