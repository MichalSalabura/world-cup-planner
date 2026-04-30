import "../../css/Filters.css";

const Filters = ({
    activeFilters,
    setActiveFilters,
    minRating,
    setMinRating,
}) => {
    const toggle = (type) => {
        setActiveFilters((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <div className="ms_filtersContainer">
            <div
                className={`ms_filterButton ${activeFilters.restaurant ? "ms_filterActive" : ""}`}
                onClick={() => toggle("restaurant")}
            >
                Restaurants
            </div>
            <div
                className={`ms_filterButton ${activeFilters.lodging ? "ms_filterActive" : ""}`}
                onClick={() => toggle("lodging")}
            >
                Hotels
            </div>
            <div
                className={`ms_filterButton ${activeFilters.tourist_attraction ? "ms_filterActive" : ""}`}
                onClick={() => toggle("tourist_attraction")}
            >
                Attractions
            </div>
            <div className="ms_ratingFilter">
                <label className="ms_ratingLabel" htmlFor="ms_ratingInput">
                    Min Rating: {minRating === 0 ? "Any" : `${minRating}`}
                </label>
                <input
                    id="ms_ratingInput"
                    className="ms_ratingInput"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                />
            </div>
        </div>
    );
};

export default Filters;
