const { compareSync } = require("bcryptjs");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const db = require("../config/db")

function check_email(email)
{
    var count = 0;

    for (let i = 0; i < email.length; i++)
        if (email[i] == '@')
            count++;
    if (count != 1)
        return true;
    return false;
}

function check_duetime(due_time)
{
    var date = new Date(due_time);

    if (date == "Invalid Date")
        return true;
    return false
}

function check_status(status)
{
    const lib = ["not started", "todo", "in progress", "done"];
    var check = 0;

    for (let i = 0; i < lib.length; i++)
        if (status === lib[i])
            check++;
    if (check == 0)
        return true;
    return false;
}

function check_body(req, res, lib) {
    for (let i = 0; i < lib.length; i++) {
        if (!req.body[lib[i]])
            return true;
    }
    if (req.body.email)
        if (check_email(req.body.email) == true)
            return true;
    if (req.body.due_time)
        if (check_duetime(req.body.due_time) == true)
            return true;
    if (req.body.status)
        if (check_status(req.body.status) == true)
            return true;
    return false;
}

function auth_ckeck(req, res, next) {
    if (req.headers.authorization == null)
        return res.json( { msg : "No token, authorization denied" });
    const token = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.json( { msg : "Token is not valid" });
    }
    const decode = jwt.decode(token, process.env.SECRET_KEY);
    const date = Math.round(+new Date()/1000);
    if (decode.exp < date)
        return res.json( { msg : "Token is expired"});
    next();
}

async function is_in_table(table, search, name) {
    try {
        const [response] = await db.connection.query(`SELECT * from ${table} where ${search} = '${name}'`);
        if (Array.isArray(response) && response.length == 0) {
            return "Not found"
        }
        } catch (err) {
            return "Not found"
    }
    return null;
}

module.exports = {
    auth_ckeck,
    is_in_table,
    check_body
};