import { useState } from "react";
import { Socket } from "socket.io-client";
import "./MainStyle.css";
import "./PlayCards.css";

const suitAscii: any = {
  spades: 9824,
  hearts: 9829,
  diams: 9830,
  clubs: 9827,
};

const MyCards = (props: any) => {
  const socket = props.socket;
  const cardClicked = (e: any) => {
    // if(props.turn === socket.id)
    // {
    socket.emit("card Chosen", e);
    // }
    // socket.emit("card Chosen", e)
  };
  // const[cards,setCards] = useState({})
  // setCards(props.cards)
  return (
    <div className="right-side-container my-cards-container">
      <h1>My Cards</h1>
      <div className="my-cards-inner-container">
        <ul className="hand">
          {props.cards[socket.id].map((cardData: any) => (
            <li
              onClick={() => {
                cardClicked(cardData);
              }}
            >
              <a
                className={`card rank-${cardData.rank} ${cardData.suit}`}
                onClick={() => {
                  cardClicked(cardData);
                }}
              >
                <span className="rank">{cardData.rank}</span>
                <span className="suit">
                  {String.fromCharCode(suitAscii[cardData.suit])}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default MyCards;
