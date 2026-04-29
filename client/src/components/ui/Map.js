import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import stadiumsData from "../../data/stadiums.json";

const libraries = ["places"];

const Map = ({ country, currentStadium }) => {
    const [places, setPlaces] = useState(null);
    const mapRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (!isLoaded) return;
        if (places) return;

        const service = new window.google.maps.places.PlacesService(
            document.createElement("div"),
        );

        service.nearbySearch(
            {
                location: { lat: 53.3498, lng: -6.2603 },
                radius: 1000,
                type: "tourist_attraction",
            },
            (results, status) => {
                if (
                    status === window.google.maps.places.PlacesServiceStatus.OK
                ) {
                    setPlaces(results);
                }
            },
        );
    }, [isLoaded]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.panTo({
                lat: currentStadium.lat,
                lng: currentStadium.lng,
            });
        }
    }, [currentStadium]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 40.8135, lng: -74.0745 }}
            zoom={12}
            onLoad={(map) => (mapRef.current = map)}
        >
            {stadiumsData.stadiums
                .filter((s) => s.country === country)
                .map((stadium) => (
                    <Marker
                        key={stadium.id}
                        position={{ lat: stadium.lat, lng: stadium.lng }}
                        title={stadium.name}
                    />
                ))}
        </GoogleMap>
    );
};

export default Map;
