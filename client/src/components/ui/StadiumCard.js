const StadiumCard = ({ stadium, onStadiumClick }) => {
    return (
        <div
            key={stadium.id}
            className="ms_stadiumCard"
            onClick={() => onStadiumClick(stadium)}
        >
            <h3>{stadium.name}</h3>
            <p>{stadium.city}</p>
        </div>
    );
};

export default StadiumCard;
