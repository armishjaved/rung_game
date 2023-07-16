import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { useState, useEffect } from "react";
import GamePage from "./GamePage";
import Messages from "./Messages";
// import ReactDOM from "react-dom";

const URL = "http://localhost:3000";
// const clientSocket = io(URL);

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) {
  // const root = ReactDOM.createRoot(document.getElementById('root'));

  // const [clientsList,setList] = useState({"server":"client"});
  // const [updatedValue,setValue] = useState({});
  const [input, setInput] = useState("");
  // const [clients,setClients] = useState(0);
  const [loading, isLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [isConnected, setisConnected] = useState(false);
  const [cap, maxCap] = useState(false);
  const [names, setNames] = useState([""]);
  const [firstFourCards, setFirstFour] = useState([]);
  const [rang, setRang] = useState(false);
  const [message, setMessages] = useState([]);
  const [cards, setCards] = useState({});
  const [rung, setRung] = useState("");
  const [turn, setTurn] = useState(true);
  const [clients, setClients] = useState([]);
  const [winner, setWinner] = useState(false);
  const [winnernames, setWinnerNames] = useState([""]);
  const [winnerteam, setWinnerTeam] = useState(0);
  const [nameDict, setNameDict] = useState([]);
  const [cDict, setCDict] = useState([]);
  const [name, setname] = useState("");
  // const [ winnerName,set]
  const handleChange = (e: any) => {
    setInput(e.target.value);
  };
  let winn = "one";

  //click handler
  const handleClick = (socket: Socket) => {
    socket.emit("myEvent", { data: input });
  };
  const sockId = socket.id;
  // useEffect(() => {
  //   {
  //     /* nned to make connection with the server here */
  //   }
  //   function onConnect() {
  //     setisConnected(true);
  //     console.log("Connection with server established");
  //   }

  //   function onDisconnect() {
  //     console.log("Connection with server dropped");
  //   }

  //   clientSocket.on("connect", onConnect);
  //   clientSocket.on("disconnect", onDisconnect);

  //   clientSocket.connect();
  //   return () => {
  //     clientSocket.off("connect", onConnect);
  //     clientSocket.off("disconnect", onDisconnect);
  //   };
  // }, [isConnected]);

  // useEffect(() =>{
  function onLoading() {
    console.log("loadinggg...");
    isLoading(true);
    setStart(false);
  }
  function onGameStart(
    names: any,
    cards: any,
    rang: any,
    messages: any,
    gamecards: any,
    rung: any,
    clients: any,
    nameDictt: any,
    cdict: any,
    pnames: any
  ) {
    console.log(socket.id, rung);
    if (sockId == rang) {
      setRang(true);
    }
    console.log("game should start..");
    setRung(rung);
    setMessages(messages);
    setCards(gamecards);
    setNames(names);
    setFirstFour(cards);
    isLoading(false);
    setStart(true);
    setTurn(false);
    setClients(clients);
    setNameDict(nameDictt);
    setCDict(cdict);
    setname(pnames);
  }
  // function name(clients:any) {
  //   for(let i=0;i<4;i++)
  //   {
  //     for(let key of clients[i].values())
  //     {
  //       if (key === sockId)
  //       {
  //        return clients[i].key()
  //       }
  //     }
  //   }
  // }

  function onCapReached() {
    maxCap(true);
  }
  function playTurn(
    names: any,
    cards: any,
    messages: any,
    gamecards: any,
    rung: any,
    turn: any,
    clients: any,
    win: any,
    team: any,
    namesss: any,
    cdict: any,
    pnames: any
  ) {
    setRung(rung);
    setMessages(messages);
    setCards(gamecards);
    setNames(names);
    setFirstFour(cards);
    isLoading(false);
    setStart(true);
    setRang(false);
    setClients(clients);
    setWinner(win);
    setWinnerTeam(team);
    setCDict(cdict);
    setNameDict(namesss);
    if (team == 1) {
      setWinnerNames([names[0], names[2]]);
    } else {
      setWinnerNames([names[1], names[3]]);
    }
    setname(pnames);
    // let nameee = cl
    // for(let i=0;i<4;i++)
    // {

    // }
    if (socket.id == turn) {
      setTurn(true);
    }
  }
  // function setNamess(names: string[]) {
  //   setNames(names);
  //   console.log(names);
  // }
  socket.on("loading", onLoading);
  socket.on("startGame", onGameStart);
  socket.on("player cap reached", onCapReached);
  socket.on("Turn", playTurn);
  // socket.on("Names", setNamess);

  // },[isConnected]);
  if (winner) {
    return (
      <div>
        <h1> Team{winnerteam} has won!!!</h1>
        <h1>
          Congratulations {winnernames[0]} & {winnernames[1]}
        </h1>
      </div>
    );
  }
  if (cap) {
    return (
      <>
        <div className="sampleHomePage">
          <h1 className="sampleTitle">Rung Game</h1>
          <div className="sampleMessage">
            <h1> Max cap for players has reached, Join Later!</h1>
          </div>
        </div>
      </>
    );
  } else if (!start) {
    if (loading) {
      return (
        <>
          <div className="sampleHomePage">
            <h1 className="sampleTitle">Rung Game</h1>
            <div className="sampleMessage">
              <h1>Waiting for more players to join... </h1>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="sampleHomePage">
            <h1 className="sampleTitle">Rung Game</h1>
            <div className="sampleMessage">
              <input
                placeholder="message"
                value={input}
                onChange={handleChange}
              ></input>
              <button onClick={() => handleClick(socket)}>
                Click me to send a message to server...
              </button>
            </div>
          </div>
        </>
      );
    }
  } else {
    return (
      // <mainPage/>
      <div>
        <h4>Rung of the Game: {rung}</h4>
        <h4 className="rung-game-name">Player name: {name}</h4>
        {/* <h3>Player Name: {clients.(socket.id)}</h3> */}
        {/* <h1>{names}</h1> */}
        <GamePage
          playerNames={names}
          Four={firstFourCards}
          cards={cards}
          socket={socket}
          messages={message}
          rung={rang}
          turn={turn}
        />
      </div>
      // root.render()
      // <GamePage playerName = {input}/>
    );
  }
}
export default HomePage;
