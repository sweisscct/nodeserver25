const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");



const PORT = 3000;
app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/chatApp')
.then(conn => console.log(conn.modles));
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        mongoURL: '127.0.0.1:27017',
        collection: 'chatApp'
    }, err => console.log(err))
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));

let viewCount = 0;

app.get("/", (req, res) => {
    console.log("Yay, a visitor!");
    // console.log(req);
    res.send("Welcome to the web server!");
})

app.get("/create-account", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/chat");
    res.sendFile("create-account.html", {root: __dirname});
})

app.post("/create-account", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/chat");
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect("/chat");
        })
    })
})

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/chat");
    res.sendFile("login.html", {root: __dirname});
})

app.post("/login", passport.authenticate('local', {failureRedirect: "/login", failureFlash: false}), (req, res) => {
    res.redirect("/chat");
})

app.get("/chat", (req, res) => {
    if (!req.isAuthenticated()) res.redirect("/login");
    res.sendFile("chat.html", {root: __dirname});
        
})

app.get("/hello", (req, res) => {
    res.send("<h1>Hello</h1><p>How are you?</p>");
})

app.get("/html", (req, res) => {
    console.log(__dirname);
    res.sendFile("index.html", {root: __dirname});
})

// url parameter
app.get("/params/:display", (req, res) => {
    res.send(req.params.display);
})

// url query
app.get("/query", (req, res) => {
    res.send(`The number is: ${req.query.number} and the text is: ${req.query.text}.`);
})

// http://localhost:3000/query?number=42&text=JavaScript

// https://moodle.cct.ie/course/view.php?id=1996#section-7

app.post("/form", (req, res) => {
    if (req.body.password == "password") {
        res.redirect("/hello");
    }
    res.send(`The username is: ${req.body.username} and the password is: ${req.body.password}`);
})

const httpServer = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

const wsServer = new WebSocket.Server( { noServer: true });

httpServer.on("upgrade", async (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
         wsServer.emit("connection", ws, request);
    });
});

// Group Chat
wsServer.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log(message);
        // process/parse
        console.log(message.toLocaleString());
        message = JSON.parse(message.toLocaleString());
        wsServer.clients.forEach(client => {
            if (client.readyState == WebSocket.OPEN) client.send(JSON.stringify(message));
        })
        // relay the message to the other clients
    })
})