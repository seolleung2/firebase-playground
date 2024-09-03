import React, { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../firebaseConfig";

export default function Write() {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const saveData = () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "nature/fruits"));
    set(newDocRef, {
      fruitName: inputValue1,
      fruitDefinition: inputValue2,
    })
      .then(() => {
        alert("data saved successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <div>
      <input type="text" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} />
      <input type="text" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)} />
      <br />
      <button onClick={saveData}>SAVE DATA</button>
    </div>
  );
}
