import { useState, useCallback } from "react";

const usePlaces = () => {
    const [pois, setPois] = useState([]);

    const fetchPlaces = useCallback((map, location, stadiumName) => {
        const service = new window.google.maps.places.PlacesService(map);
        const types = ["lodging", "restaurant", "tourist_attraction"];

        setPois([]);

        types.forEach((type) => {
            service.nearbySearch(
                {
                    location,
                    radius: 20000,
                    type,
                },
                (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const tagged = results
                        .filter((r) => r.name !== stadiumName)
                        .map((r) => ({
                            ...r,
                            category: type,
                        }));
                        setPois((prev) => [...prev, ...tagged]);
                    }
                },
            );
        });
    }, []);

    return [ pois, fetchPlaces ];
};

export default usePlaces;