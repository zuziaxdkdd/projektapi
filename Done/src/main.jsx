import React from "react";
import ReactDOM from "react-dom/client";
import "./scss/main.css";
import Characters from "./components/Characters"; 
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Gra from "./components/Gra";
import Episodes from "./components/Episodes";
import Locations from "./components/Locations";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/episodes" element={<Episodes/>} />
        <Route path="/locations" element={<Locations/>} />
        <Route path="/gra" element={<Gra/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
