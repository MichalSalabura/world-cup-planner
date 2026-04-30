import React from "react";
import stadiums from "../../data/stadiums.json";
import StadiumCard from "./StadiumCard";
import "../../css/Stadiums.css";

const Stadiums = ({ chosenCountry, setCurrentStadium }) => {
    const filteredStadiums = stadiums.stadiums.filter(
        (s) => s.country === chosenCountry,
    );

    return (
        <div className="ms_stadiumsContainer">
            <div className="ms_stadiumsTitleContainer">
                <p className="ms_stadiumsTitle">Stadiums:</p>
            </div>
            <div className="ms_stadiumsCardsWrapper">
            {filteredStadiums.map((stadium) => (
                <StadiumCard
                    key={stadium.id}
                    stadium={stadium}
                    onStadiumClick={setCurrentStadium}
                />
            ))}
            </div>
        </div>
    );
};

export default Stadiums;
