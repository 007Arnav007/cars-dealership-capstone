import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealer/Dealer";
import PostReview from "./components/PostReview/PostReview";

export default function App() {
  return (
    <>
      <Header />
      <div className="page">
        <Routes>
          <Route path="/" element={<Dealers />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dealer/:id" element={<Dealer />} />
          <Route path="/postreview/:id" element={<PostReview />} />
        </Routes>
      </div>
    </>
  );
}
