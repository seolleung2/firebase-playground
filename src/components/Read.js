import { useEffect, useRef, useState } from "react";
import { getDatabase, ref, get, update, remove, onValue, off } from "firebase/database";
import app from "../firebaseConfig";

import Modal from "./ui/Modal";

export default function Read() {
  const db = getDatabase(app);
  const dataRef = ref(db, "nature/fruits");

  const nameRef = useRef(null);
  const definitionRef = useRef(null);

  const [fruitList, setFruitList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fruitInfo, setFruitInfo] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFruitInfo(null);
  };

  const handleOpenModal = (fruit) => {
    setFruitInfo(fruit);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      const initialFruitArray = [];
      for (const [key, value] of Object.entries(snapshot.val())) {
        const fruit = { ...value };
        fruit.id = key;
        initialFruitArray.push(fruit);
      }
      setFruitList(initialFruitArray);
    } else {
      alert("error");
    }
  };

  const handleDeleteFruit = (fruitId) => {
    const dbRef = ref(db, `nature/fruits/${fruitId}`);

    remove(dbRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFruitInfo = {
      ...fruitInfo,
      fruitName: nameRef.current.value,
      fruitDefinition: definitionRef.current.value,
    };
    const dbRef = ref(db, `nature/fruits/${fruitInfo.id}`);
    return update(dbRef, updatedFruitInfo);
  };

  useEffect(() => {
    // onValue 리스너 설정
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const initialFruitArray = [];
      for (const [key, value] of Object.entries(snapshot.val())) {
        const fruit = { ...value };
        fruit.id = key;
        initialFruitArray.push(fruit);
      }
      setFruitList(initialFruitArray);
    });

    // 컴포넌트가 언마운트될 때 리스너 해제
    return () => {
      off(dataRef); // Firebase의 'off' 메서드를 사용해 리스너 해제
      unsubscribe(); // 안전하게 리스너를 정리하기 위해 unsubscribe 호출
    };
    // eslint-disable-next-line
  }, []); // 빈 배열을 두어 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <>
      <div>
        <button onClick={fetchData}> Display Data </button>
        <ul>
          {fruitList.map((fruit, index) => (
            <li key={index}>
              <span>
                {fruit.fruitName}: {fruit.fruitDefinition}
              </span>
              <button onClick={() => handleOpenModal(fruit)}>Edit</button>
              <button onClick={() => handleDeleteFruit(fruit.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>과일 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="name">과일 이름</label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              defaultValue={fruitInfo?.fruitName || ""}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="description">정의</label>
            <input
              type="text"
              id="description"
              ref={definitionRef}
              defaultValue={fruitInfo?.fruitDefinition || ""}
              style={{ width: "100%" }}
            />
          </div>
          <button type="button" onClick={handleCloseModal}>
            닫기
          </button>
          <button type="submit">제출</button>
        </form>
      </Modal>
    </>
  );
}
