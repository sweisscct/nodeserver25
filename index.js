const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log("Yay, a visitor!");
    // console.log(req);
    res.send("Welcome to the web server!");
})

app.get("/hello", (req, res) => {
    res.send("<h1>Hello</h1><p>How are you?</p>");
})

app.get("/html", (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});