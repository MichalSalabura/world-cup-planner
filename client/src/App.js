import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.js";
import Header from "./components/layout/Header.js";
import "./styles/App.css";

export const App = (props) => {
    return (
        <BrowserRouter>
            <div className="ms_appContainer">
                <Header />
                <div className="ms_pageContent">
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
