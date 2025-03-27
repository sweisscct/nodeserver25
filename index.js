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


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});