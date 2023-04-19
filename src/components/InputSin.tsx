import { ChangeEvent, KeyboardEvent, useState } from "react";

const InputSin = () => {
  const [sin, setSin] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSin(event.target.value);
  };

  const onAddClick = () => {
    if (!sin) {
      alert("You need to confess!");
      return;
    }
    setSin("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAddClick();
    }
  };

  return (
    <div>
      <input
        placeholder="Enter text"
        className="text-black p-2 rounded-xl"
        onChange={handleChange}
        value={sin}
        onKeyDown={handleKeyDown}
      />
      <button onClick={onAddClick}>ADD</button>
    </div>
  );
};

export default InputSin;
