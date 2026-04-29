import React, { useState, useEffect } from "react";
import stadiumsData from "../data/stadiums.json";
import Map from "../components/ui/Map";
import Stadiums from "../components/ui/Stadiums";
import Filters from "../components/ui/Filters";
import usePlaces from "../hooks/usePlaces";
import "../css/Home.css";

export const Home = ({ currentCountry }) => {
    const [currentStadium, setCurrentStadium] = useState(null);
    const [pois, fetchPlaces] = usePlaces();
    const [activeFilters, setActiveFilters] = useState({
        restaurant: true,
        lodging: true,
        tourist_attraction: true,
    });

    useEffect(() => {
        const first = stadiumsData.stadiums.find(
            (s) => s.country === currentCountry,
        );
        setCurrentStadium(first);
    }, [currentCountry]);

    return (
        <div className="ms_container">
            <div id="ms_mapContainer">
                <Filters
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                />
                <Map
                    country={currentCountry}
                    currentStadium={currentStadium}
                    pois={pois}
                    fetchPlaces={fetchPlaces}
                    activeFilters={activeFilters}
                />
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
