import { User, getAuth, signOut } from "firebase/auth";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../_app";
import uuid from "react-uuid";

const db = getFirestore(app);

interface Sin {
  id: number;
  userId: string;
  text: string;
  timestamp: number;
}

interface Karma {
  userId: string;
  score: number;
}

export default function App({ user }: { user: User | null }) {
  const [sin, setSin] = useState("");
  const [sins, setSins] = useState<Sin[]>([]);
  const [karma, setKarma] = useState<Karma | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSin(event.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSinClick();
    }
  };

  async function getSins() {
    const sinsRef = collection(db, "sins");

    const queryItems = query(sinsRef, where("userId", "==", user?.uid));
    const querySnapshot = await getDocs(queryItems);

    const fetchedSins: Sin[] = [];
    querySnapshot.forEach((item) => {
      const itemData = item.data() as Sin;
      fetchedSins.push(itemData);
    });
    fetchedSins.sort();
    setSins(fetchedSins);
  }

  async function getKarma() {
    const karmaRef = collection(db, "karma");
    const queryItems = query(karmaRef, where("userId", "==", user?.uid));
    const querySnapshot = await getDocs(queryItems);

    if (!querySnapshot.empty) {
      const karmaDoc = querySnapshot.docs[0];
      const karmaData = karmaDoc.data() as Karma;

      // Set the initial karma data to the state 'karma'.
      setKarma(karmaData);
    }
  }

  async function updateKarma() {
    const karmaRef = collection(db, "karma");

    const queryItems = query(karmaRef, where("userId", "==", user?.uid));
    const querySnapshot = await getDocs(queryItems);

    if (!querySnapshot.empty) {
      // Assuming there is only one karma record per user. If not, handle accordingly.
      const karmaDoc = querySnapshot.docs[0];
      const existingKarma = karmaDoc.data() as Karma;

      const randomScore = Math.floor(Math.random() * 10) + 1;

      const updatedKarmaScore = existingKarma.score + randomScore; // Increase karma score by 10 (for example).

      // Update the karma score in Firestore.
      await updateDoc(doc(db, "karma", karmaDoc.id), {
        score: updatedKarmaScore,
      });

      // Optionally, you can also update the local state with the new karma score.
      setKarma((prevKarma) => {
        if (prevKarma) {
          return { ...prevKarma, score: updatedKarmaScore };
        } else {
          return null;
        }
      });
    } else {
      const newKarma = {
        userId: user?.uid || "",
        score: 0,
      };
      await addDoc(karmaRef, newKarma);
      setKarma(newKarma);
    }
  }

  useEffect(() => {
    getSins();
    getKarma();
  }, []);

  async function onSinClick() {
    const id = uuid();
    if (!sin) {
      alert("You need to confess!");
    } else {
      await setDoc(doc(db, "sins", id), {
        id,
        userId: user?.uid,
        text: sin,
        timestamp: Date.now(),
      });
    }
    await getSins();
    await updateKarma();
    setSin("");
  }

  const logout = () => {
    const auth = getAuth();

    if (user) {
      signOut(auth) // Call the Firebase signOut method passing the authentication instance
        .then(() => {
          // Successfully signed out, redirect or handle user state accordingly
          window.location.href = "/login"; // Redirect to the login page or any other appropriate page
        })
        .catch((error) => {
          // Handle any errors that occurred during sign out
          console.error("Sign out error:", error);
        });
    }
  };

  return (
    <div className="flex flex-col ">
      <h1 className="text-3xl flex justify-center pb-20">Hell Counter</h1>
      <div className="flex flex-row static">
        <div className="absolute left-80">
          {sins.map((sin) => (
            <div
              className="bg-stone-400 mt-2 mb-2 p-2 rounded-full "
              key={sin.id}
            >
              {sin.text}
            </div>
          ))}
        </div>
        <div className="absolute bottom-80 top-60 right-60">
          <h1 className="text-8xl mb-20 ml-24">{karma?.score || 0}</h1>
          <h2>Enter Sin:</h2>
          <input
            placeholder="Enter text"
            className="text-black p-2 rounded-xl"
            onChange={handleChange}
            value={sin}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-red-500 p-2 ml-2 rounded-xl"
            onClick={onSinClick}
          >
            ADD
          </button>
        </div>
      </div>
      <button
        className="mt-5 bg-red-500 text-white text-center rounded-md shadow-md p-4 w-48"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
