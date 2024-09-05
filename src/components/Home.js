import { useState } from "react";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Home() {
  const [file, setFile] = useState(null);

  const saveJsonToFirestore = async (collectionName, documentId, data) => {
    try {
      await setDoc(doc(db, collectionName, documentId), data);
      console.log("JSON 데이터가 Firestore에 성공적으로 저장되었습니다.");
    } catch (e) {
      console.error("Firestore에 데이터를 저장하는 도중 오류 발생: ", e);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const result = event.target.result;
          console.log("🚀 ~ reader.onload= ~ result:", result);

          // result가 string 타입인지 확인
          if (typeof result === "string") {
            const jsonData = JSON.parse(result);
            console.log("🚀 ~ reader.onload= ~ jsonData:", jsonData);
            const clinics = jsonData.clinics;

            clinics.forEach(async (clinic) => {
              await saveJsonToFirestore("clinics-test", `clinic-${clinic.id}`, clinic);
            });

            // await saveJsonToFirestore("clinics-test", "documentId", clinics);
          } else {
            console.error("파일의 내용을 읽는 도중 오류 발생: 예상치 못한 데이터 형식입니다.");
          }
        } catch (error) {
          console.error("파일을 읽거나 파싱하는 도중 오류 발생: ", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>Root Page</h2>
      <div>
        <input type="file" accept="application/json" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload JSON to Firestore</button>
      </div>
    </div>
  );
}
