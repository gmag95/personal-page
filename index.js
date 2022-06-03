if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

const port=process.env.PORT

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/flood-it", (req, res) => {
    res.render("apps/flood-it");
})

app.get("/sudoku", (req, res) => {
    res.render("apps/sudoku");
})

app.get("/sorter", (req, res) => {
    res.render("apps/sorter");
})

app.get("/shortest-path", (req, res) => {
    res.render("apps/shortest-path");
})

app.get("/blackjack", (req, res) => {
    res.render("apps/blackjack");
})

app.all("*", (req, res) => {
    res.render("error");
})