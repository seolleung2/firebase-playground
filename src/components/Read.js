import React, { useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebaseConfig";

export default function Read() {
  const [fruitArray, setFruitArray] = useState([]);

  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "nature/fruits");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      setFruitArray(Object.values(snapshot.val()));
    } else {
      alert("error");
    }
  };

  return (
    <div>
      <button onClick={fetchData}> Display Data </button>
      <ul>
        {fruitArray.map((fruit, index) => (
          <li key={index}>
            {fruit.fruitName}: {fruit.fruitDefinition}
          </li>
        ))}
      </ul>
    </div>
  );
}
