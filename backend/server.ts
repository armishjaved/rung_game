
const { Socket } = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
let clients = {};
let clientids: any = [];
let noof_clients = 0;
let names: any = [];
let playCards: any = {};
let firstFiveCards: any = {};
type Suit = "hearts" | "diams" | "clubs" | "spades";
type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "j" | "q" | "k" | "a";
let rung = "";
let clientDict = {};
let roundRung = {};
let teamone = 0;
let teamtwo = 0;
let turnnum = 1;
let nameDict = [{}];

interface Card {
  rank: Rank;
  suit: Suit;
}

const suits: Suit[] = ["hearts", "diams", "clubs", "spades"];
const ranks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "j", "q", "k", "a"];

const deck: Card[] = [];

for (const suit of suits) {
  for (const rank of ranks) {
    deck.push({ rank, suit });
  }
}
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const pref = {
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 8,
  j: 9,
  q: 10,
  k: 11,
  a: 12,
};

const shuffledDeck = shuffleArray(deck);
const reshuffledDeck = shuffleArray(shuffledDeck);
let start = 0;
let firstfourCards = {};
let count = 0;
let count2 = 1;
function cardsforRang(array: any): void {
  firstfourCards[0] = shuffledDeck[0];
  for (let i = 1; i < 52; i++) {
    count = 0;
    for (let j = 0; j < count2; j++) {
      if (shuffledDeck[i].rank == firstfourCards[j].rank) {
        count = 1;
        break;
      }
    }
    if (count == 1) {
      continue;
    } else {
      firstfourCards[count2] = shuffledDeck[i];
      count2++;
      if (firstfourCards[3]) {
        break;
      }
    }
  }
}
cardsforRang(firstfourCards);
let turn = 0;

for (let i = 1; i < 4; i++) {
  if (pref[firstfourCards[turn].rank] < pref[firstfourCards[i].rank]) {
    turn = i;
  }
}
let messages = [""];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
function updateCards(cardtoRemove: any, socketid: any) {
  console.log("cards: ", playCards);
  let index = 0;
  for (let i = 0; i < playCards[socketid].length; i++) {
    if (
      playCards[socketid][i].suit == cardtoRemove.suit &&
      playCards[socketid][i].rank == cardtoRemove.rank
    ) {
      index = i;
      break;
    }
  }
  playCards[socketid].splice(index, 1);
  console.log("upcards: ", playCards);
}
function checkiFirstTurn(): boolean {
  let count = 0;
  let cardd = { rank: "", suit: "" };
  for (let i = 0; i < 4; i++) {

    if (playCards[clientids[i]].includes(firstfourCards[i])) {
      count++;
    }
  }
  if (count <= 4) {
    return true;
  }
  return false;
}
function checkiLastTurn(): boolean {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (playCards[clientids[i]].includes(firstfourCards[i])) {
      count++;
    }
  }
  if (count == 3) {
    return true;
  }
  return false;
}
function checkWinner(): any {
  let rungcount = 0;
  for (let i = 0; i < 4; i++) {
    if (firstfourCards[i].suit === rung) {
      rungcount++;
    }
  }
  if (rungcount == 1) {
    for (let i = 0; i < 4; i++) {
      if (firstfourCards[i].suit === rung) {
        return i;
      }
    }
  } else if (rungcount > 1) {
    let rankkk = 2;
    let winn = 0;
    for (let i = 0; i < 4; i++) {
      if (firstfourCards[i].suit === rung) {
        winn = i;
        if (pref[firstfourCards[i].rank] > pref[rankkk]) {
          rankkk = firstfourCards[i].rank;
          winn = i;
        }
      }
    }
    return winn;
  } else {
    let rankkk = 2;
    let winn = 0;
    for (let i = 0; i < 4; i++) {
      if (firstfourCards[i].suit == roundRung) {
        winn = i;
        if (pref[firstfourCards[i].rank] === pref[rankkk]) {
          rankkk = firstfourCards[i].rank;
          winn = i;
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      if (firstfourCards[i].suit == roundRung) {
        // winn
        if (pref[firstfourCards[i].rank] > pref[rankkk]) {
          rankkk = firstfourCards[i].rank;
          winn = i;
        }
      }
    }
    return winn;
  }
}

function checkIfRungExists(rung: any, socketid: any): boolean {
  for (let i = 0; i < playCards[socketid].length; i++) {
    if (playCards[socketid][i].suit === rung) {
      return true;
    }
  }
  return false;
}

server.listen(3001, () => {
  console.log("SERVER IS LISTENING ON PORT 3001");
});

io.on("connection", (socket) => {
  console.log("user connected with a socket id", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    //implement the game finished here
  });
  socket.on("Rung Chosen", (rang) => {
    rung = rang.rung;
    messages.push(`${names[turn]} will be taking the turn`);
    for (let i = 0; i < 4; i++) {
      firstfourCards[i] = { rank: "", suit: "" };
    }
    io.emit(
      "Turn",
      names,
      firstfourCards,
      messages.reverse(),
      playCards,
      rung,
      clientids[turn],
      clients,
      false,
      0,
      nameDict,
      clientDict,
      names[turn]
    );
  });

  socket.on("card Chosen", (cardChosen) => {
    if (socket.id != clientids[turn]) {
      messages.push(`${clients[socket.id]} : its ${names[turn]}'s turn `);
    } else {
      console.log("turnnum: ", turnnum);
      console.log("turn: ", turn);
      console.log("clientids: ", clientids);
      console.log("sockid: ", socket.id);
      // console.log()
      console.log("cardChosen");
      // con
      //if condition  - check if the whole cards of first four empty - true /false
      if (turnnum === 1) {
        // console.log("hgfdhg")
        roundRung = cardChosen.suit;
        firstfourCards[turn] = cardChosen;
        updateCards(cardChosen, socket.id);
        turn = (turn + 1) % 4;
        messages.push(`${names[turn]} will be taking the turn`);
        console.log(cardChosen);
        // console.log(firstfourCards)
        turnnum++;
        io.emit(
          "Turn",
          names,
          firstfourCards,
          messages.reverse(),
          playCards,
          rung,
          clientids[turn],
          clients,
          false,
          0,
          nameDict,
          clientDict,
          names[turn]
        );
      } else {
        if (cardChosen.suit === roundRung) {
          if (turnnum == 4) {
            let winn = checkWinner();
            console.log("winner ", checkWinner());
            if (winn == 0 || winn == 2) {
              teamone++;
              messages.push(`${names[winn]} won this round`);
              messages.push(`${teamone}:${teamtwo}`);
            } else {
              teamtwo++;
              messages.push(`team two won this round`);
              messages.push(`${teamone}:${teamtwo}`);
            }
            if (teamone >= 7) {
              messages.push(`team one won the game`);
              updateCards(cardChosen, socket.id);
              io.emit(
                "Turn",
                names,
                firstfourCards,
                messages.reverse(),
                playCards,
                rung,
                clientids[turn],
                clients,
                true,
                1,
                nameDict,
                clientDict,
                names[turn]
              );
            } else if (teamtwo >= 7) {
              messages.push(`team two won the game`);
              updateCards(cardChosen, socket.id);
              io.emit(
                "Turn",
                names,
                firstfourCards,
                messages.reverse(),
                playCards,
                rung,
                clientids[turn],
                clients,
                true,
                2,
                nameDict,
                clientDict,
                names[turn]
              );
            } else {
              firstfourCards[turn] = cardChosen;
              updateCards(cardChosen, socket.id);
              turn = winn;
              turnnum = 1;
              messages.push(
                `${names[turn]} will be taking the turn and lead for the new round`
              );
              io.emit(
                "Turn",
                names,
                firstfourCards,
                messages.reverse(),
                playCards,
                rung,
                clientids[turn],
                clients,
                false,
                0,
                nameDict,
                clientDict,
                names[turn]
              );
            }
          } else {
            firstfourCards[turn] = cardChosen;
            updateCards(cardChosen, socket.id);
            turn = (turn + 1) % 4;
            messages.push(`${names[turn]} will be taking the turn`);
            // console.log(cardChosen)
            // console.log(firstfourCards)
            turnnum++;
            io.emit(
              "Turn",
              names,
              firstfourCards,
              messages.reverse(),
              playCards,
              rung,
              clientids[turn],
              clients,
              false,
              0,
              nameDict,
              clientDict,
              names[turn]
            );

          }
        } else {
          if (checkIfRungExists(roundRung, socket.id)) {
            messages.push(
              `${names[turn]} have the required card(s), choose from them please`
            );
            io.emit(
              "Turn",
              names,
              firstfourCards,
              messages.reverse(),
              playCards,
              rung,
              clientids[turn],
              clients,
              false,
              0,
              nameDict,
              clientDict,
              names[turn]
            );
          } else if (turnnum == 4) {
            console.log("winner: ", checkWinner());
            let winn = checkWinner();
            if (winn == 0 || winn == 2) {
              teamone++;
              messages.push(`team one won this round`);
              messages.push(`${teamone}:${teamtwo}`);
            } else {
              teamtwo++;
              messages.push(`team two won this round`);
              messages.push(`${teamone}:${teamtwo}`);
            }
            if (teamone >= 7) {
              io.emit(
                "Turn",
                names,
                firstfourCards,
                messages.reverse(),
                playCards,
                rung,
                clientids[turn],
                clients,
                true,
                1,
                nameDict,
                clientDict,
                names[turn]
              );
            } else if (teamtwo >= 7) {
              io.emit(
                "Turn",
                names,
                firstfourCards,
                messages.reverse(),
                playCards,
                rung,
                clientids[turn],
                clients,
                true,
                2,
                nameDict,
                clientDict,
                names[turn]
              );
            } else {
              firstfourCards[turn] = cardChosen;
              updateCards(cardChosen, socket.id);
              turn = winn;
              turnnum = 1;
              messages.push(`${names[turn]} will be taking the turn`);
              io.emit(
                "Turn",
                names,
                firstfourCards,
                messages.reverse(),
                playCards,
                rung,
                clientids[turn],
                clients,
                false,
                0,
                nameDict,
                clientDict,
                names[turn]
              );
            }
          } else {
            firstfourCards[turn] = cardChosen;
            updateCards(cardChosen, socket.id);
            turn = (turn + 1) % 4;
            messages.push(`${names[turn]} will be taking the turn`);
            turnnum++;
            io.emit(
              "Turn",
              names,
              firstfourCards,
              messages.reverse(),
              playCards,
              rung,
              clientids[turn],
              clients,
              false,
              0,
              nameDict,
              clientDict,
              names[turn]
            );

          }
        }
        //winner use state in home - if true change display for all with winner team
        //check if carf is roung rungg --  check winner else normal next turn condition
        //check if roundrung card in players playcards[socektit] -- if yes and card chosen not from it then message + io . emit -- else next
        //if firstfourcardsd[3] exists -- choose round winner - update number a disply -- upddate turn to leader --firstfourcards = {} --message -- update playcards
        //round winner -- if first four cards - rung - highets from rung - else highest from round rung
      }
    }
    //check if card clicked not from turn-- message - playername: only turn can choose a card
  });

  //add custom events here
  socket.on("myEvent", (myData) => {
    noof_clients += 1;
    if (noof_clients < 4) {
      names.push(myData.data);
      clients[socket.id] = myData.data;
      clientids.push(socket.id);
      io.emit("loading", {});
    } else if (noof_clients == 4) {
      clients[socket.id] = myData.data;
      names.push(myData.data);
      clientids.push(socket.id);
      for (let i = 0; i < 4; i++) {
        playCards[clientids[i]] = deck.slice(start, start + 13);
        start = start + 13;
      }
      // console.log(playCards);
      // console.log(playCards)
      // console.log(clientids)
      for (let i = 0; i < 4; i++) {
        // playCards[ ]
        firstFiveCards[clientids[i]] = playCards[clientids[i]].slice(0, 5);
      }
      messages.push(`${names[turn]} will be choosing the rang for the game`);
      // console.log(messages);
      clientDict[clientids[0]] = 0;
      clientDict[clientids[1]] = 1;
      clientDict[clientids[2]] = 2;
      clientDict[clientids[3]] = 3;
      nameDict[clientids[0]] = { sockett: names[0] };
      nameDict[clientids[1]] = { sockett: names[1] };
      nameDict[clientids[2]] = { sockett: names[2] };
      nameDict[clientids[3]] = { sockett: names[3] };
      // console.log(clientDict)
      // console.log(firstfourCards)
      // console.log(clients)
      messages.push(
        `${names[0]} & ${names[2]} are team one, and ${names[1]} & ${names[3]} are team two`
      );
      messages.push(` ${teamone}: ${teamtwo}`);
      io.emit(
        "startGame",
        names,
        firstfourCards,
        clientids[turn],
        messages.reverse(),
        firstFiveCards,
        rung,
        clients,
        nameDict,
        clientDict,
        names[turn]
      );
      //   io.emit("Turn 0 - choose rang", names,firstfourCards);
      //   io.emit(firstfourCards)
      //send first one card here, implement and choose rang and get a message from the client,
      // recieve that here and implement the rest of the game - divide remaining cards,
      //keep of check of winning condition, and rang, and whose turn it is
      // divide into more components
      //update evertyhting correctly each time - my cards, chosen card. whose turn, who has won how many turns
      //implement the messages part
      //first turn of highrst rank person here then general code for all moves to keep a check of moves
      //each next round -- new clear board
    } else if (noof_clients > 5) {
      io.emit("player cap reached");
    }
  });
});
