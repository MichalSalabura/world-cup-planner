import "../../styles/Filters.css";

const Filters = ({ activeFilters, setActiveFilters }) => {
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
        </div>
    );
};

export default Filters;
