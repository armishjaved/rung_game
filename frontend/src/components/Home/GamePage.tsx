import "./MainStyle.css";
import "./PlayCards.css";
import Messages from "./Messages";
import { useState } from "react";
import SelectRang from "./SelectRang";
import { Socket } from "socket.io-client";
import MyCards from "./MyCards";
const GamePage = (props: any) => {
  const [Rang, setRang] = useState(false);
  const [myTurn, setmyTurn] = useState(false);
  const [cards, setCards] = useState({});

  const socket = props.socket;
  // setCards(props.cards);
  // setRang(props.rung);
  // socket.on("Choose Rnag", setRang(true));
  // setRang(props.selectRang);
  // console.log(props.rung)
  // if(props.selectRang == true) {
  //     setRang(true)
  // }
  // console.log("gamepage")
  //   cons
  const suitAscii: any = {
    spades: 9824,
    hearts: 9829,
    diams: 9830,
    clubs: 9827,
  };

  // let names = props.names;
  return (
    // <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <div className="main-container playingCards">
      <div className="game-container">
        <div className="heading-container">
          <h1>Rang</h1>
        </div>
        <div className="game-table-container">
          <div className="game-table">
            <div className="card-area">
              <div className="card-area-rows output-row-one">
                <div
                  className={`card rank-${props.Four[2].rank} ${props.Four[2].suit}`}
                >
                  <span className="rank">{props.Four[2].rank}</span>
                  <span className="suit">
                    {String.fromCharCode(suitAscii[props.Four[2].suit])}
                  </span>
                </div>
              </div>
              <div className="card-area-rows output-row-two">
                <div
                  className={`card rank-${props.Four[1].rank}  ${props.Four[1].suit}`}
                >
                  {/* <p>{props.Four[1].rank}</p> */}
                  <span className="rank">{props.Four[1].rank}</span>
                  <span className="suit">
                    {String.fromCharCode(suitAscii[props.Four[1].suit])}
                  </span>
                </div>
                <div
                  className={`card rank-${props.Four[3].rank} ${props.Four[3].suit}`}
                >
                  {/* <p>{props.Four[0].rank}</p> */}
                  <span className="rank">{props.Four[3].rank}</span>
                  <span className="suit">
                    {String.fromCharCode(suitAscii[props.Four[3].suit])}
                  </span>
                </div>
              </div>
              <div className="card-area-rows output-row-three">
                <div
                  className={`card rank-${props.Four[0].rank} ${props.Four[0].suit}`}
                >
                  {/* <p>{props.Four[0].rank}</p> */}
                  <span className="rank">{props.Four[0].rank}</span>
                  <span className="suit">
                    {String.fromCharCode(suitAscii[props.Four[0].suit])}
                  </span>
                </div>
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-one">
                {props.playerNames[0]}
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-two">
                {props.playerNames[1]}
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-three">
                {props.playerNames[2]}
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-four">
                {props.playerNames[3]}
              </div>
            </div>
          </div>
        </div>

        {/* <div> */}
        {/* <div> */}
        {props.rung ? <SelectRang socket={socket} /> : <></>}
        {/* </div>  add condition herer*/}
      </div>
      <div className="messages-and-cards-container">
        <Messages messages={props.messages} />

        <div className="right-side-container my-cards-container">
          <MyCards cards={props.cards} socket={socket} turn={props.turn} />
        </div>
      </div>
    </div>
  );
};
export default GamePage;
