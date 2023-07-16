// import { SyntheticModule } from "vm";
var Socket = require("socket.io").Socket;
// import Math
var express = require("express");
var app = express();
var http = require("http");
var Server = require("socket.io").Server;
var cors = require("cors");
app.use(cors());
var clients = {};
var clientids = [];
var noof_clients = 0;
var names = [];
var playCards = {};
var firstFiveCards = {};
var rung = "";
var clientDict = {};
var roundRung = {};
var teamone = 0;
var teamtwo = 0;
var turnnum = 1;
var nameDict = [{}];
var suits = ["hearts", "diams", "clubs", "spades"];
var ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "j", "q", "k", "a"];
var deck = [];
for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
    var suit = suits_1[_i];
    for (var _a = 0, ranks_1 = ranks; _a < ranks_1.length; _a++) {
        var rank = ranks_1[_a];
        deck.push({ rank: rank, suit: suit });
    }
}
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
var pref = {
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
    a: 12
};
var shuffledDeck = shuffleArray(deck);
var reshuffledDeck = shuffleArray(shuffledDeck);
var start = 0;
var firstfourCards = {};
var count = 0;
var count2 = 1;
function cardsforRang(array) {
    firstfourCards[0] = shuffledDeck[0];
    // console.log(firstfourCards)
    // console.log()
    //   shuffledDeck.splice(0, 1);
    for (var i = 1; i < 52; i++) {
        count = 0;
        for (var j = 0; j < count2; j++) {
            if (shuffledDeck[i].rank == firstfourCards[j].rank) {
                count = 1;
                break;
            }
        }
        if (count == 1) {
            continue;
        }
        else {
            firstfourCards[count2] = shuffledDeck[i];
            count2++;
            //   shuffledDeck.splice(i, 1);
            if (firstfourCards[3]) {
                break;
            }
        }
    }
}
cardsforRang(firstfourCards);
var turn = 0;
for (var i = 1; i < 4; i++) {
    if (pref[firstfourCards[turn].rank] < pref[firstfourCards[i].rank]) {
        turn = i;
    }
}
// console.log("turn: " + turn);
var messages = [""];
// app.use(cors())
var server = http.createServer(app);
var io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
function updateCards(cardtoRemove, socketid) {
    console.log("cards: ", playCards);
    var index = 0;
    for (var i = 0; i < playCards[socketid].length; i++) {
        if (playCards[socketid][i].suit == cardtoRemove.suit &&
            playCards[socketid][i].rank == cardtoRemove.rank) {
            index = i;
            break;
        }
        // playCards[socketid].splice(index,1);
        // console.log("upcards: ",playCards)
    }
    playCards[socketid].splice(index, 1);
    console.log("upcards: ", playCards);
}
function checkiFirstTurn() {
    var count = 0;
    var cardd = { rank: "", suit: "" };
    for (var i = 0; i < 4; i++) {
        // for (let j=0;j<4;j++)
        // {
        if (playCards[clientids[i]].includes(firstfourCards[i])) {
            count++;
        }
    }
    if (count <= 4) {
        return true;
    }
    return false;
}
function checkiLastTurn() {
    var count = 0;
    // let cardd = {rank:'', suit : '' }
    for (var i = 0; i < 4; i++) {
        if (playCards[clientids[i]].includes(firstfourCards[i])) {
            count++;
        }
    }
    if (count == 3) {
        return true;
    }
    return false;
}
function checkWinner() {
    // for le
    var rungcount = 0;
    for (var i = 0; i < 4; i++) {
        if (firstfourCards[i].suit === rung) {
            rungcount++;
        }
    }
    if (rungcount == 1) {
        for (var i = 0; i < 4; i++) {
            if (firstfourCards[i].suit === rung) {
                return i;
            }
        }
    }
    else if (rungcount > 1) {
        var rankkk = 2;
        var winn = 0;
        for (var i = 0; i < 4; i++) {
            if (firstfourCards[i].suit === rung) {
                winn = i;
                if (pref[firstfourCards[i].rank] > pref[rankkk]) {
                    rankkk = firstfourCards[i].rank;
                    winn = i;
                }
            }
        }
        return winn;
    }
    else {
        var rankkk = 2;
        var winn = 0;
        for (var i = 0; i < 4; i++) {
            if (firstfourCards[i].suit == roundRung) {
                winn = i;
                if (pref[firstfourCards[i].rank] === pref[rankkk]) {
                    rankkk = firstfourCards[i].rank;
                    winn = i;
                }
            }
        }
        for (var i = 0; i < 4; i++) {
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
function checkIfRungExists(rung, socketid) {
    for (var i = 0; i < playCards[socketid].length; i++) {
        if (playCards[socketid][i].suit === rung) {
            return true;
        }
    }
    return false;
}
server.listen(3001, function () {
    console.log("SERVER IS LISTENING ON PORT 3001");
});
io.on("connection", function (socket) {
    console.log("user connected with a socket id", socket.id);
    socket.on("disconnect", function () {
        console.log("user disconnected");
        //implement the game finished here
    });
    socket.on("Rung Chosen", function (rang) {
        rung = rang.rung;
        messages.push("".concat(names[turn], " will be taking the turn"));
        for (var i = 0; i < 4; i++) {
            firstfourCards[i] = { rank: "", suit: "" };
        }
        io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
    });
    socket.on("card Chosen", function (cardChosen) {
        if (socket.id != clientids[turn]) {
            messages.push("".concat(clients[socket.id], " : its ").concat(names[turn], "'s turn "));
        }
        else {
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
                messages.push("".concat(names[turn], " will be taking the turn"));
                console.log(cardChosen);
                // console.log(firstfourCards)
                turnnum++;
                io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
            }
            else {
                if (cardChosen.suit === roundRung) {
                    if (turnnum == 4) {
                        var winn = checkWinner();
                        console.log("winner ", checkWinner());
                        if (winn == 0 || winn == 2) {
                            teamone++;
                            messages.push("".concat(names[winn], " won this round"));
                            messages.push("".concat(teamone, ":").concat(teamtwo));
                        }
                        else {
                            teamtwo++;
                            messages.push("team two won this round");
                            messages.push("".concat(teamone, ":").concat(teamtwo));
                        }
                        if (teamone >= 7) {
                            messages.push("team one won the game");
                            updateCards(cardChosen, socket.id);
                            io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, true, 1, nameDict, clientDict, names[turn]);
                        }
                        else if (teamtwo >= 7) {
                            messages.push("team two won the game");
                            updateCards(cardChosen, socket.id);
                            io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, true, 2, nameDict, clientDict, names[turn]);
                        }
                        else {
                            firstfourCards[turn] = cardChosen;
                            updateCards(cardChosen, socket.id);
                            turn = winn;
                            turnnum = 1;
                            messages.push("".concat(names[turn], " will be taking the turn and lead for the new round"));
                            io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
                        }
                    }
                    else {
                        firstfourCards[turn] = cardChosen;
                        updateCards(cardChosen, socket.id);
                        turn = (turn + 1) % 4;
                        messages.push("".concat(names[turn], " will be taking the turn"));
                        // console.log(cardChosen)
                        // console.log(firstfourCards)
                        turnnum++;
                        io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
                        // roundRung = cardChosen.suit
                    }
                }
                else {
                    if (checkIfRungExists(roundRung, socket.id)) {
                        messages.push("".concat(names[turn], " have the required card(s), choose from them please"));
                        io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
                    }
                    else if (turnnum == 4) {
                        console.log("winner: ", checkWinner());
                        var winn = checkWinner();
                        if (winn == 0 || winn == 2) {
                            teamone++;
                            messages.push("team one won this round");
                            messages.push("".concat(teamone, ":").concat(teamtwo));
                        }
                        else {
                            teamtwo++;
                            messages.push("team two won this round");
                            messages.push("".concat(teamone, ":").concat(teamtwo));
                        }
                        if (teamone >= 7) {
                            io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, true, 1, nameDict, clientDict, names[turn]);
                        }
                        else if (teamtwo >= 7) {
                            io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, true, 2, nameDict, clientDict, names[turn]);
                        }
                        else {
                            firstfourCards[turn] = cardChosen;
                            updateCards(cardChosen, socket.id);
                            turn = winn;
                            turnnum = 1;
                            messages.push("".concat(names[turn], " will be taking the turn"));
                            io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
                        }
                    }
                    else {
                        firstfourCards[turn] = cardChosen;
                        updateCards(cardChosen, socket.id);
                        turn = (turn + 1) % 4;
                        messages.push("".concat(names[turn], " will be taking the turn"));
                        // console.log(cardChosen)
                        // console.log(firstfourCards)
                        turnnum++;
                        io.emit("Turn", names, firstfourCards, messages.reverse(), playCards, rung, clientids[turn], clients, false, 0, nameDict, clientDict, names[turn]);
                        // roundRung = cardChosen.suit
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
    socket.on("myEvent", function (myData) {
        noof_clients += 1;
        if (noof_clients < 4) {
            names.push(myData.data);
            clients[socket.id] = myData.data;
            clientids.push(socket.id);
            io.emit("loading", {});
        }
        else if (noof_clients == 4) {
            clients[socket.id] = myData;
            names.push(myData.data);
            clientids.push(socket.id);
            // console.log(names);
            // console.log(firstfourCards);
            // console.log("Clients::: ",clients)
            // console.log(turn)
            for (var i = 0; i < 4; i++) {
                // playCards[ ]
                playCards[clientids[i]] = deck.slice(start, start + 13);
                start = start + 13;
            }
            // console.log(playCards);
            // console.log(playCards)
            // console.log(clientids)
            for (var i = 0; i < 4; i++) {
                // playCards[ ]
                firstFiveCards[clientids[i]] = playCards[clientids[i]].slice(0, 5);
            }
            messages.push("".concat(names[turn], " will be choosing the rang for the game"));
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
            messages.push("".concat(names[0], " & ").concat(names[2], " are team one, and ").concat(names[1], " & ").concat(names[3], " are team two"));
            messages.push(" ".concat(teamone, ": ").concat(teamtwo));
            io.emit("startGame", names, firstfourCards, clientids[turn], messages.reverse(), firstFiveCards, rung, clients, nameDict, clientDict, names[turn]);
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
        }
        else if (noof_clients > 5) {
            io.emit("player cap reached");
        }
    });
});
