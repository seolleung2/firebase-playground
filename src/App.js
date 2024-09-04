import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Write from "./components/Write";
import Read from "./components/Read";
import Home from "./components/Home";
import FireStoreTestPage from "./components/FireStoreTestPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<Write />} />
          <Route path="/read" element={<Read />} />
          <Route path="/firestore" element={<FireStoreTestPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
