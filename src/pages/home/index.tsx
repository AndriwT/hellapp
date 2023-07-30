import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  DocumentData,
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

type UserData = DocumentData | null;

export default function App({ user }: { user: User | null }) {
  const [userData, setUserData] = useState<UserData>(null);
  const [sin, setSin] = useState("");
  const [sins, setSins] = useState<Sin[]>([]);
  const [karma, setKarma] = useState<Karma | null>(null);

  async function getSins() {
    const sinsRef = collection(db, "sins");

    const queryItems = query(sinsRef, where("userId", "==", user?.uid));
    const querySnapshot = await getDocs(queryItems);

    const fetchedSins: Sin[] = [];
    querySnapshot.forEach((item) => {
      const itemData = item.data() as Sin;
      fetchedSins.push(itemData);
    });
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

  async function getUserData(email: string | null) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      return null;
    }
  }

  useEffect(() => {
    getSins();
    getKarma();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If the user is authenticated, get user data from Firestore
        const userData = await getUserData(user.email);
        setUserData(userData);
      } else {
        // Handle when user is not authenticated
        setUserData(null);
      }
    });
    return () => unsubscribe();
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
      await getSins();
      await updateKarma();
    }

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSin(event.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSinClick();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-[#CA6702] text-5xl flex justify-center pb-4 mt-12">
        Welcome {userData?.username} !
      </h1>
      <h2 className="text-[#BB3E03] text-4xl flex justify-center pb-20">
        This is your HellCount
      </h2>
      <div className="flex flex-col  items-center bottom-80 right-60">
        <h1 className="flex justify-center items-center text-[#AE2012] text-8xl mb-12 w-52 h-52 rounded-full shadow-[#9B2226] shadow-md">
          {karma?.score || 0}
        </h1>
        <div className="flex mb-10">
          <input
            placeholder="Confess your Sin"
            className="text-[#F7F1DE] bg-[#002C3D] p-2 rounded-l-xl shadow-md w-72 h-16 outline-none border-[#002C3D]"
            onChange={handleChange}
            value={sin}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-[#AE2012] text-[#F7F1DE] hover:bg-[#CB2415] focus:bg-[#A61E11] p-2 rounded-r-xl shadow-md click:shadow-inner w-24 border-none"
            onClick={onSinClick}
          >
            Log Sin
          </button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        <div className="flex flex-col h-screen">
          <div className="overflow-y-auto">
            {sins.map((sin) => (
              <div
                className="bg-[#9B2226] mt-2 mb-2 p-8 w-96 rounded-xl shadow-md "
                key={sin.id}
              >
                <p className="text-[#F7F1DE]">{sin.text}</p>
                <p className="text-xs text-[#CA6702]">
                  {new Date(sin.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className="mt-8 mb-4 bg-[#AE2012] text-[#F7F1DE] hover:bg-[#CB2415] focus:bg-[#A61E11] text-center rounded-xl shadow-md p-4 w-48 static"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
