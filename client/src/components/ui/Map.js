import React, { useEffect, useRef, useState } from "react";
import stadiumsData from "../../data/stadiums.json";
import stadiumIcon from "../../assets/icons/stadium-arena-svgrepo-com.svg";
import bedIcon from "../../assets/icons/hotel-left-side-bed-svgrepo-com.svg";
import restaurantIcon from "../../assets/icons/restaurant-cutlery-svgrepo-com.svg";
import ticketIcon from "../../assets/icons/ticket-01-svgrepo-com.svg";

const Map = ({
    country,
    currentStadium,
    pois,
    fetchPlaces,
    activeFilters,
    routeStops,
    setRouteStops,
    isRoutingMode,
    setRouteError,
    minRating,
}) => {
    const mapDivRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const stadiumMarkersRef = useRef([]);
    const poiMarkersRef = useRef([]);
    const routeMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const directionsServiceRef = useRef(null);
    const isRoutingModeRef = useRef(false);
    const routeStopsRef = useRef([]);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        isRoutingModeRef.current = isRoutingMode;
    }, [isRoutingMode]);
    useEffect(() => {
        routeStopsRef.current = routeStops;
    }, [routeStops]);

    // create map instance
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

        directionsServiceRef.current =
            new window.google.maps.DirectionsService();
        directionsRendererRef.current =
            new window.google.maps.DirectionsRenderer({
                suppressMarkers: true,
            });
        directionsRendererRef.current.setMap(mapInstanceRef.current);

        mapInstanceRef.current.addListener("click", (e) => {
            if (!isRoutingModeRef.current) return;

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: e.latLng }, (results, status) => {
                const name =
                    status === "OK" && results[0]
                        ? results[0].formatted_address
                        : `Stop ${routeStopsRef.current.length + 1}`;

                setRouteStops((prev) => [
                    ...prev,
                    {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                        name,
                    },
                ]);
                setRouteError("");
            });
        });

        setMapReady(true);
    }, [setRouteError, setRouteStops]);

    // move map to current stadium
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
    }, [currentStadium, mapReady, fetchPlaces]);

    // create stadium marker + infowindow
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
                            <div id="ms_infoWindowWiki">Loading info...</div>
                        </div>
                    `);
                    infoWindowRef.current.open(mapInstanceRef.current, marker);

                    if (stadium.placeId) {
                        const service =
                            new window.google.maps.places.PlacesService(
                                mapInstanceRef.current,
                            );
                        service.getDetails(
                            {
                                placeId: stadium.placeId,
                                fields: ["photos", "rating", "opening_hours"],
                            },
                            (place, status) => {
                                if (
                                    status ===
                                        window.google.maps.places
                                            .PlacesServiceStatus.OK &&
                                    place.photos?.length > 0
                                ) {
                                    const photoUrl = place.photos[0].getUrl({
                                        maxWidth: 300,
                                        maxHeight: 200,
                                    });
                                    infoWindowRef.current.setContent(`
                                                                    <div class="ms_infoWindow">
                                                                        <img src="${photoUrl}" alt="${stadium.name}" class="ms_infoWindowPhoto" />
                                                                        <h3>${stadium.name}</h3>
                                                                        <p>${stadium.city}</p>
                                                                        ${place.rating ? `<p>${place.rating} / 5</p>` : ""}
                                                                        ${place.opening_hours ? `<p>${place.opening_hours.open_now ? "Open now" : "Closed"}</p>` : ""}
                                                                        <div id="ms_infoWindowWiki">Loading info...</div>
                                                                    </div>
                                                                `);
                                    infoWindowRef.current.open(
                                        mapInstanceRef.current,
                                        marker,
                                    );
                                }
                            },
                        );
                    }

                    fetch(
                        `https://en.wikipedia.org/api/rest_v1/page/summary/${stadium.name}`,
                    )
                        .then((res) => {
                            if (!res) throw new Error("Not found");
                            return res.json();
                        })
                        .then((data) => {
                            const wikiDiv =
                                document.getElementById("ms_infoWindowWiki");
                            if (!wikiDiv) return;
                            wikiDiv.innerHTML = `
                                        <div class="ms_wikiSummary">
                                            <p>${data.extract}</p>
                                            <a href="${data.content_urls.desktop.page}" target="_blank" rel="noreferrer">Read more on Wikipedia</a>
                                        </div>
                        `;
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                });

                stadiumMarkersRef.current.push(marker);
            });
    }, [country, mapReady]);

    // create poi markers and their infowindows on click
    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current) return;

        poiMarkersRef.current.forEach((m) => m.setMap(null));
        poiMarkersRef.current = [];

        const POI_ICONS = {
            lodging: {
                url: bedIcon,
                scaledSize: new window.google.maps.Size(30, 30),
            },
            restaurant: {
                url: restaurantIcon,
                scaledSize: new window.google.maps.Size(30, 30),
            },
            tourist_attraction: {
                url: ticketIcon,
                scaledSize: new window.google.maps.Size(30, 30),
            },
        };

        pois.filter((poi) => activeFilters[poi.category])
            .filter(
                (poi) => !minRating || (poi.rating && poi.rating >= minRating),
            )
            .forEach((poi) => {
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
                        <div id="ms_infoWindowWiki">Loading info...</div>
                    </div>
                `);
                    infoWindowRef.current.open(mapInstanceRef.current, marker);

                    fetch(
                        `https://en.wikipedia.org/api/rest_v1/page/summary/${poi.name}`,
                    )
                        .then((res) => {
                            if (!res) throw new Error("Not found");
                            return res.json();
                        })
                        .then((data) => {
                            const wikiDiv =
                                document.getElementById("ms_infoWindowWiki");
                            if (!wikiDiv) return;
                            wikiDiv.innerHTML = `
                                        <div class="ms_wikiSummary">
                                            <p>${data.extract}</p>
                                            <a href="${data.content_urls.desktop.page}" target="_blank" rel="noreferrer">Read more on Wikipedia</a>
                                        </div>
                        `;
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                });

                poiMarkersRef.current.push(marker);
            });
    }, [pois, mapReady, activeFilters, minRating]);

    // create route
    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current) return;

        routeMarkersRef.current.forEach((m) => m.setMap(null));
        routeMarkersRef.current = [];

        if (routeStops.length < 2) {
            directionsRendererRef.current.setDirections({ routes: [] });
        }

        routeStops.forEach((stop, i) => {
            const marker = new window.google.maps.Marker({
                position: { lat: stop.lat, lng: stop.lng },
                map: mapInstanceRef.current,
                label: {
                    text: `${i + 1}`,
                    color: "white",
                    fontWeight: "bold",
                },
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 14,
                    fillColor: "#e63946",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                },
            });
            routeMarkersRef.current.push(marker);
        });

        if (routeStops.length >= 2) {
            const origin = { lat: routeStops[0].lat, lng: routeStops[0].lng };
            const destination = {
                lat: routeStops[routeStops.length - 1].lat,
                lng: routeStops[routeStops.length - 1].lng,
            };
            const waypoints = routeStops.slice(1, -1).map((stop) => ({
                location: { lat: stop.lat, lng: stop.lng },
                stopover: true,
            }));

            directionsServiceRef.current.route(
                {
                    origin,
                    destination,
                    waypoints,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK") {
                        directionsRendererRef.current.setDirections(result);
                    } else {
                        setRouteError(
                            "Could not calculate route. Try selecting different locations.",
                        );
                    }
                },
            );
        }
    }, [routeStops, mapReady, setRouteError]);

    return <div ref={mapDivRef} className="ms_map" />;
};

export default Map;
