import "../../css/Route.css";

const RouteControls = ({
    isRoutingMode,
    setIsRoutingMode,
    routeStops,
    setRouteStops,
}) => {
    return (
        <div className="ms_routeControls">
            <button
                className={`ms_routeToggle ${isRoutingMode ? "ms_routeToggleActive" : ""}`}
                onClick={() => {
                    setIsRoutingMode(!isRoutingMode);
                    if (isRoutingMode) setRouteStops([]);
                }}
            >
                {isRoutingMode ? "Exit Route Mode" : "Plan a Route"}
            </button>

            {isRoutingMode && (
                <div className="ms_routePanel">
                    <p className="ms_routeHint">
                        Click anywhere on the map to add a stop.
                    </p>
                    {routeStops.length === 0 && (
                        <p className="ms_routeEmpty">No stops added yet.</p>
                    )}
                    {routeStops.map((stop, i) => (
                        <div key={i} className="ms_routeStop">
                            <span>
                                {i + 1}. {stop.name}
                            </span>
                            <button
                                className="ms_routeStopRemove"
                                onClick={() =>
                                    setRouteStops(
                                        routeStops.filter(
                                            (_, idx) => idx !== i,
                                        ),
                                    )
                                }
                            >
                                remove
                            </button>
                        </div>
                    ))}
                    {routeStops.length > 0 && (
                        <button
                            className="ms_routeClear"
                            onClick={() => setRouteStops([])}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RouteControls;