import React, { useState, useEffect } from "react";
import stadiumsData from "../data/stadiums.json";
import Map from "../components/ui/Map";
import Stadiums from "../components/ui/Stadiums";
import Filters from "../components/ui/Filters";
import usePlaces from "../hooks/usePlaces";
import RouteControls from "../components/ui/RouteControls";
import Weather from "../components/ui/Weather";
import "../css/Home.css";

export const Home = ({ currentCountry }) => {
    const [currentStadium, setCurrentStadium] = useState(null);
    const [pois, fetchPlaces, placesError] = usePlaces();
    const [activeFilters, setActiveFilters] = useState({
        restaurant: true,
        lodging: true,
        tourist_attraction: true,
    });
    const [routeStops, setRouteStops] = useState([]);
    const [isRoutingMode, setIsRoutingMode] = useState(false);
    const [routeError, setRouteError] = useState("");
    const [minRating, setMinRating] = useState(0);

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
                    minRating={minRating}
                    setMinRating={setMinRating}
                />
                {placesError && <p className="ms_error">{placesError}</p>}
                <Map
                    country={currentCountry}
                    currentStadium={currentStadium}
                    pois={pois}
                    fetchPlaces={fetchPlaces}
                    activeFilters={activeFilters}
                    routeStops={routeStops}
                    setRouteStops={setRouteStops}
                    isRoutingMode={isRoutingMode}
                    setRouteError={setRouteError}
                    minRating={minRating}
                />
                <Weather stadium={currentStadium} />
                <RouteControls
                    isRoutingMode={isRoutingMode}
                    setIsRoutingMode={setIsRoutingMode}
                    routeStops={routeStops}
                    setRouteStops={setRouteStops}
                    routeError={routeError}
                    setRouteError={setRouteError}
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
