import { User, getAuth, signOut } from "firebase/auth";
import { ChangeEvent, KeyboardEvent, useState } from "react";

export default function App({ user }: { user: User | null }) {
  const [sin, setSin] = useState("");
  const [sins, setSins] = useState<string[]>([]);
  const [karma, setKarma] = useState(0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSin(event.target.value);
  };

  const onAddClick = () => {
    if (!sin) {
      alert("You need to confess!");
      return;
    }
    setSin("");
    setSins([...sins, sin]);
    setKarma(karma + Math.floor(Math.random() * 10) + 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAddClick();
    }
  };

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
            <div className="bg-stone-400 mt-2 mb-2 p-2 rounded-full " key={sin}>
              {sin}
            </div>
          ))}
        </div>
        <div className="absolute bottom-80 top-60 right-60">
          <h1 className="text-8xl mb-20 ml-24">{karma}</h1>
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
            onClick={onAddClick}
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
