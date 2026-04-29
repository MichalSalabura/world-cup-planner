import React, { useState, useEffect } from "react";
import stadiumsData from "../data/stadiums.json";
import Map from "../components/ui/Map";
import Stadiums from "../components/ui/Stadiums";
import "../styles/Home.css";

export const Home = ({ currentCountry }) => {
    const [currentStadium, setCurrentStadium] = useState(null);

    useEffect(() => {
        const first = stadiumsData.stadiums.find(
            (s) => s.country === currentCountry,
        );
        setCurrentStadium(first);
    }, [currentCountry]);

    return (
        <div className="ms_container">
            <div id="ms_mapContainer">
                <Map country={currentCountry} currentStadium={currentStadium} />
            </div>
            <div className="ms_stadiumCardsContainer">
                <Stadiums
                    chosenCountry={currentCountry}
                    setCurrentStadium={setCurrentStadium}
                />
            </div>
        </div>
    );
};

export default Home;
