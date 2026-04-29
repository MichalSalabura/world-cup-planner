import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.js";
import Header from "./components/layout/Header.js";
import "./styles/App.css";

export const App = (props) => {
    const [country, setCountry] = useState("USA");
    return (
        <BrowserRouter>
            <div className="ms_appContainer">
                <Header setCountry={setCountry} />
                <div className="ms_pageContent">
                    <Routes>
                        <Route path="/" element={<Home currentCountry={country} />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
