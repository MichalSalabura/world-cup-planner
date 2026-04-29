import React, { useState, useEffect, useRef } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import stadiumsData from "../../data/stadiums.json";
import MarkerInformation from "./MarkerInformation";

const libraries = ["places"];

const POI_COLORS = {
    lodging: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    restaurant: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    tourist_attraction:
        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
};

const Map = ({ country, currentStadium, pois, fetchPlaces }) => {
    const mapRef = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (!mapRef.current || !currentStadium || !isLoaded) return;
        mapRef.current.panTo({
            lat: currentStadium.lat,
            lng: currentStadium.lng,
        });
        mapRef.current.setZoom(14);
        fetchPlaces(mapRef.current, {
            lat: currentStadium.lat,
            lng: currentStadium.lng,
        });
    }, [currentStadium, isLoaded]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 40.8135, lng: -74.0745 }}
            zoom={12}
            options={{
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                    },
                    {
                        featureType: "transit",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                    },
                ],
            }}
            onLoad={(map) => {
                mapRef.current = map;
                if (currentStadium) {
                    map.panTo({
                        lat: currentStadium.lat,
                        lng: currentStadium.lng,
                    });
                    map.setZoom(14);
                    fetchPlaces(map, {
                        lat: currentStadium.lat,
                        lng: currentStadium.lng,
                    });
                }
            }}
        >
            {pois.map((poi, index) => (
                <Marker
                    key={index}
                    position={{
                        lat: poi.geometry.location.lat(),
                        lng: poi.geometry.location.lng(),
                    }}
                    icon={POI_COLORS[poi.category]}
                    onClick={() => setSelectedMarker({ ...poi, type: "poi" })}
                />
            ))}
            {stadiumsData.stadiums
                .filter((s) => s.country === country)
                .map((stadium) => (
                    <Marker
                        key={stadium.id}
                        position={{ lat: stadium.lat, lng: stadium.lng }}
                        title={stadium.name}
                        onClick={() =>
                            setSelectedMarker({ ...stadium, type: "stadium" })
                        }
                    />
                ))}
            {selectedMarker && (
                <InfoWindow
                    position={
                        selectedMarker.type === "stadium"
                            ? {
                                  lat: selectedMarker.lat,
                                  lng: selectedMarker.lng,
                              }
                            : {
                                  lat: selectedMarker.geometry.location.lat(),
                                  lng: selectedMarker.geometry.location.lng(),
                              }
                    }
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <MarkerInformation selectedMarker={selectedMarker} />
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default Map;
