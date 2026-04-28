import React from "react";
import "../../styles/Header.css";

const Header = () => {
    return (
        <div className="ms_headerContainer">
            <ul className="ms_countryList">
                <li className="ms_countryListItem">USA</li>
                <li className="ms_countryListItem">Canada</li>
                <li className="ms_countryListItem">Mexico</li>
            </ul>
        </div>
    )
};

export default Header