import React from "react";
import stadiums from "../../data/stadiums.json";
import StadiumCard from "./StadiumCard";
import "../../styles/Stadiums.css";

const Stadiums = ({ chosenCountry, setCurrentStadium }) => {
    const filteredStadiums = stadiums.stadiums.filter(
        (s) => s.country === chosenCountry,
    );

    return (
        <div className="ms_stadiumsContainer">
            {filteredStadiums.map((stadium) => (<StadiumCard stadium={stadium} onStadiumClick={setCurrentStadium}/>))}
        </div>
    );
};

export default Stadiums;
