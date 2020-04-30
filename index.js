require('dotenv').config();
const express = require('express');
const config = require('./config');
const TicTacToe = require('./TicTacToe');
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, { 
    lazyLoading: true
});
const sendText = (from, to, body) => {
    console.log(to);
    console.log(body);
    twilioClient.messages.create({from: from, to: to, body: body});
};
const app = express();
let games = [];
app.use(express.urlencoded({extended: true}));
app.use(express.json());



app.get('/', function(req, res) {
    console.log('here');
    console.log(req.body);
    console.log(req.query);
    let game = games.find((game) => {
        return game.X === req.query.From || game.O === req.query.From;
    });
    if(!game) {
        const emptyGame = games.find((game) => {
            return !game.O;
        });
        if(emptyGame) {
            emptyGame.O = req.query.From;
            emptyGame.instance = new TicTacToe();
            game = emptyGame;
            sendText(req.query.To, req.query.From, "You have joined a game! Wait for your partner to play. You are O");
            sendText(req.query.To, game.X, `You got a partner now. Please play! Choose a number on the board and type it in
${game.instance.getGrid()}. You are X`);
    return res.send('200');

        } else {
            games.push({X: req.query.From, O: null, instance: null});
            sendText(req.query.To, req.query.From, "You have joined a game. Please wait for a partner");
            console.log(games);
            return res.send('200');
        }
    }
    if(!game.O) {
        sendText(req.query.To, req.query.From, "You are already in a game. Please be patient");
        return res.send('200');
    }
    if (req.query.Body === 'LEAVE') {
        sendText(req.query.To, game.X, "Game is over. To Rejoin send any text to this number");
        sendText(req.query.To, game.O, "Game is over. To Rejoin send any text to this number");
        games = games.filter((game1) => game1 !== game);
        return res.send('200');
    }
    // actual turn logic here

    if(/^[0-8]$/.test(req.query.Body) && game[game.instance.getPlayer()] === req.query.From) {
        game.instance.play(Number.parseInt(req.query.Body));
        const text = `A new turn has happened
${game.instance.getGrid()}
It is currently ${game.instance.getPlayer()}'s turn. If that is you, send a number to play`
        sendText(req.query.To, game.X, text);
        sendText(req.query.To, game.O, text);
        if(game.instance.checkWinner() === true) {
            sendText(req.query.To, game.X, 'You won!');
            sendText(req.query.To, game.O, 'You lost!');
            games = games.filter((game1) => game1 !== game);
            return res.send('200');
        }
        if(game.instance.checkWinner() === false) {
            sendText(req.query.To, game.O, 'You won!');
            sendText(req.query.To, game.X, 'You lost!');
            games = games.filter((game1) => game1 !== game);
            return res.send('200');

        }
        if(game.instance.boardFull()) {
            sendText(req.query.To, game.O, 'You tied!');
            sendText(req.query.To, game.X, 'You tied!');
            games = games.filter((game1) => game1 !== game);
            return res.send('200');
        }
        res.send('200');
        return;
    }
    sendText(req.query.To, req.query.From, "Invalid move or it is not your turn");
    res.send('200');
});

app.listen(config.port);
// const instance = new TicTacToe();
// instance.checkWinner();
// while(instance.checkWinner() === null && instance.boardFull() === false) {
//     instance.play(Math.floor(Math.random() * 9));
// }
// console.log('winner is', instance.checkWinner());
// console.log(instance.getGrid());
