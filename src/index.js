const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./routes/auth/auth");
const todos = require("./routes/todos/todos");
const user = require("./routes/user/user");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const db = require("./config/db");

app.get("/", (req, res) => {
    res.send("Welcome in our todos list");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", auth);
app.use("/todos", todos);
app.use("/user", user);

app.listen(port, () => {
    console.log(` Example app listening at http :// localhost : $ { port } `);
})
