const MarkerInformation = ({ selectedMarker }) => {
    if (selectedMarker.type === "stadium") {
        return (
            <div>
                <h3>{selectedMarker.name}</h3>
                <p>{selectedMarker.city}</p>
                {selectedMarker.notable && <p>{selectedMarker.notable}</p>}
            </div>
        );
    }

    return (
        <div>
            <h3>{selectedMarker.name}</h3>
            <p>{selectedMarker.vicinity}</p>
            {selectedMarker.rating && <p>{selectedMarker.rating} / 5</p>}
            {selectedMarker.opening_hours && (
                <p>
                    {selectedMarker.opening_hours.open_now
                        ? "Open now"
                        : "Closed"}
                </p>
            )}
        </div>
    );
};

export default MarkerInformation;
