import "./MainStyle.css";
import "./PlayCards.css";

const SelectRang = (props: any) => {
  const socket = props.socket;
  const handleDiamClick = () => {
    socket.emit("Rung Chosen", { rung: "diams" });
  };
  const handleHeartsClick = () => {
    socket.emit("Rung Chosen", { rung: "hearts" });
  };
  const handleSpadesClick = () => {
    socket.emit("Rung Chosen", { rung: "spades" });
  };
  const handleClubsClick = () => {
    socket.emit("Rung Chosen", { rung: "clubs" });
  };
  //on click for all
  //send back the chosen suit

  return (
    <div className="select-rang-container">
      <h3>Select Rang:</h3>
      <button className="button-select-rang" onClick={handleDiamClick}>
        Diamond
      </button>
      <button className="button-select-rang" onClick={handleHeartsClick}>
        Hearts
      </button>
      <button className="button-select-rang" onClick={handleSpadesClick}>
        Spades
      </button>
      <button className="button-select-rang" onClick={handleClubsClick}>
        Clubs
      </button>
    </div>
  );
};
export default SelectRang;
