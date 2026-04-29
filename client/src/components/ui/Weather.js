import React, { useEffect, useState } from "react";
import "../../css/Weather.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const Weather = ({ stadium }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!stadium) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError("");
            setWeather(null);

            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${stadium.lat}&lon=${stadium.lng}&appid=${API_KEY}&units=metric`,
                );
                if (!res.ok) throw new Error("Weather not available");
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                setError("Could not load weather");
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [stadium]);

    if (!stadium) return null;
    if (loading)
        return <div className="ms_weatherContainer">Loading Weather...</div>;
    if (error)
        return (
            <div className="ms_weatherContainer ms_weatherError">{error}</div>
        );
    if (!weather) return null;

    return (
        <div className="ms_weatherContainer">
            <p className="ms_weatherCity">{weather.name}</p>
            <p className="ms_weatherTemp">{Math.round(weather.main.temp)}C</p>
            <p className="ms_weatherDesc">{weather.weather[0].description}</p>
            <p className="ms_weatherHumidity">{weather.main.humidity}%</p>
            <p className="ms_weatherWind">
                {Math.round(weather.wind.speed)} m/s
            </p>
        </div>
    );
};

export default Weather;
