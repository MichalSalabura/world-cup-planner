import { useState, useCallback } from "react";

const usePlaces = () => {
    const [pois, setPois] = useState([]);

    const fetchPlaces = useCallback((map, location) => {
        const service = new window.google.maps.places.PlacesService(map);
        const types = ["lodging", "restaurant", "tourist_attraction"];

        setPois([]);

        types.forEach((type) => {
            service.nearbySearch(
                {
                    location,
                    radius: 2000,
                    type,
                },
                (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const tagged = results.map((r) => ({
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