import React, { useState } from "react";
import { Home } from "./pages/Home.js";
import Header from "./components/layout/Header.js";
import "./css/App.css";

export const App = (props) => {
    const [country, setCountry] = useState("USA");
    return (
        <div className="ms_appContainer">
            <Header setCountry={setCountry} />
            <div className="ms_pageContent">
                <Home currentCountry={country} />
            </div>
        </div>
    );
};

export default App;
