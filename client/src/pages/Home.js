import React from "react";
import Map from "../components/ui/Map";
import "../styles/Home.css";

export const Home = (props) => {
    return (
        <div class="ms_container">
            <div id="ms_mapContainer">
                <Map />
            </div>
        </div>
    );
};

export default Home;
