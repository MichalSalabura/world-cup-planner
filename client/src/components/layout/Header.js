import React from "react";
import "../../css/Header.css";

const Header = ({ setCountry }) => {
    return (
        <div className="ms_headerContainer">
            <ul className="ms_countryList">
                <li
                    className="ms_countryListItem"
                    onClick={() => setCountry("USA")}
                >
                    USA
                </li>
                <li
                    className="ms_countryListItem"
                    onClick={() => setCountry("Canada")}
                >
                    Canada
                </li>
                <li
                    className="ms_countryListItem"
                    onClick={() => setCountry("Mexico")}
                >
                    Mexico
                </li>
            </ul>
        </div>
    );
};

export default Header;
