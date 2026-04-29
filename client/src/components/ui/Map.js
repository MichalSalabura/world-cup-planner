import React, { useEffect, useRef, useState } from "react";
import stadiumsData from "../../data/stadiums.json";
import stadiumIcon from "../../assets/icons/stadium-arena-svgrepo-com.svg";
import bedIcon from "../../assets/icons/hotel-left-side-bed-svgrepo-com.svg";
import restaurantIcon from "../../assets/icons/restaurant-cutlery-svgrepo-com.svg";
import ticketIcon from "../../assets/icons/ticket-01-svgrepo-com.svg";

const POI_ICONS = {
    lodging: { url: bedIcon, scaledSize: new window.google.maps.Size(30, 30) },
    restaurant: {
        url: restaurantIcon,
        scaledSize: new window.google.maps.Size(30, 30),
    },
    tourist_attraction: {
        url: ticketIcon,
        scaledSize: new window.google.maps.Size(30, 30),
    },
};

const Map = ({ country, currentStadium, pois, fetchPlaces, activeFilters }) => {
    const mapDivRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const stadiumMarkersRef = useRef([]);
    const poiMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if (!mapDivRef.current || !window.google) return;

        mapInstanceRef.current = new window.google.maps.Map(mapDivRef.current, {
            center: { lat: 39.8283, lng: -98.5795 },
            zoom: 4,
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
        });

        infoWindowRef.current = new window.google.maps.InfoWindow();
        setMapReady(true);
    }, []);

    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current || !currentStadium) return;
        mapInstanceRef.current.panTo({
            lat: currentStadium.lat,
            lng: currentStadium.lng,
        });
        mapInstanceRef.current.setZoom(14);
        fetchPlaces(
            mapInstanceRef.current,
            { lat: currentStadium.lat, lng: currentStadium.lng },
            currentStadium.name,
        );
    }, [currentStadium, mapReady]);

    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current) return;

        stadiumMarkersRef.current.forEach((m) => m.setMap(null));
        stadiumMarkersRef.current = [];

        stadiumsData.stadiums
            .filter((s) => s.country === country)
            .forEach((stadium) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: stadium.lat, lng: stadium.lng },
                    map: mapInstanceRef.current,
                    title: stadium.name,
                    icon: {
                        url: stadiumIcon,
                        scaledSize: new window.google.maps.Size(30, 30),
                    },
                });

                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(`
                        <div>
                            <h3>${stadium.name}</h3>
                            <p>${stadium.city}</p>
                            ${stadium.notable ? `<p>${stadium.notable}</p>` : ""}
                        </div>
                    `);
                    infoWindowRef.current.open(mapInstanceRef.current, marker);
                });

                stadiumMarkersRef.current.push(marker);
            });
    }, [country, mapReady]);

    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current) return;

        poiMarkersRef.current.forEach((m) => m.setMap(null));
        poiMarkersRef.current = [];

        pois.filter((poi) => activeFilters[poi.category]).forEach((poi) => {
            const marker = new window.google.maps.Marker({
                position: {
                    lat: poi.geometry.location.lat(),
                    lng: poi.geometry.location.lng(),
                },
                map: mapInstanceRef.current,
                icon: POI_ICONS[poi.category],
            });

            marker.addListener("click", () => {
                const photoUrl =
                    poi.photos && poi.photos.length > 0
                        ? poi.photos[0].getUrl({
                              maxWidth: 300,
                              maxHeight: 200,
                          })
                        : null;
                infoWindowRef.current.setContent(`
                    <div class="ms_infoWindow">
                        ${photoUrl ? `<img src="${photoUrl}" alt="${poi.name}" class="ms_infoWindowPhoto" />` : ""}
                        <h3>${poi.name}</h3>
                        <p>${poi.vicinity}</p>
                        ${poi.rating ? `<p>${poi.rating} / 5</p>` : ""}
                        ${poi.opening_hours ? `<p>${poi.opening_hours.open_now ? "Open now" : "Closed"}</p>` : ""}
                    </div>
                `);
                infoWindowRef.current.open(mapInstanceRef.current, marker);
            });

            poiMarkersRef.current.push(marker);
        });
    }, [pois, mapReady, activeFilters]);

    return <div ref={mapDivRef} className="ms_map" />;
};

export default Map;
