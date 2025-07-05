import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";      // Seu App.jsx principal
import Aula1 from "./Aula1";  // Aula criada

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/aulas/aula1" element={<Aula1 />} />
        {/* <Route path="/aulas/aula2" element={<Aula2 />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
