import React, { useState } from "react";
import "../../css/Header.css";

const Header = ({ setCountry }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleCountrySelect = (country) => {
        setCountry(country);
        setMenuOpen(false);
    };

    return (
        <div className="ms_headerContainer">
            <button
                className="ms_hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span
                    className={`ms_hamburgerLine ${menuOpen ? "ms_hamburgerOpen" : ""}`}
                ></span>
                <span
                    className={`ms_hamburgerLine ${menuOpen ? "ms_hamburgerOpen" : ""}`}
                ></span>
                <span
                    className={`ms_hamburgerLine ${menuOpen ? "ms_hamburgerOpen" : ""}`}
                ></span>
            </button>
            <ul
                className={`ms_countryList ${menuOpen ? "ms_countryListOpen" : ""}`}
            >
                <li
                    className="ms_countryListItem"
                    onClick={() => handleCountrySelect("USA")}
                >
                    USA
                </li>
                <li
                    className="ms_countryListItem"
                    onClick={() => handleCountrySelect("Canada")}
                >
                    Canada
                </li>
                <li
                    className="ms_countryListItem"
                    onClick={() => handleCountrySelect("Mexico")}
                >
                    Mexico
                </li>
            </ul>
        </div>
    );
};

export default Header;
