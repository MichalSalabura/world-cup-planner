import React, { useState, useEffect } from "react";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const Map = () => {
    const [places, setPlaces] = useState(null);

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

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: 53.3498, lng: -6.2603 }}
            zoom={12}
        />
    );
};

export default Map;
