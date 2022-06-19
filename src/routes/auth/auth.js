const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const env = require("dotenv").config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const middleware = require("../../middleware/auth");

async function check_exists(email) {
        const [response] = await db.connection.query(`SELECT email FROM user WHERE email = '${email}';`);
        if (Array.isArray(response) && response.length > 0)
            return true;
        else
            return false;
}

function get_token(email) {
    return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn : "2 days"});
}

router.post("/register", async (req, res) => {
    if (middleware.check_body(req, res, ["name", "email", "password", "firstname"]) == true)
        return res.json({ msg : "Bad parameter"});
    const email = req.body['email'];
    const name = req.body['name']
    const firstname = req.body['firstname']
    const password = req.body['password']
    const hash_pwd = bcrypt.hashSync(password, 10);
    db.connection.query("USE " + process.env.MYSQL_DATABASE);
    if (await check_exists(email))
        return res.send("Account already exists");
    await db.connection.query(`INSERT INTO user(email, name, firstname, password) VALUES ('${email}', '${name}', '${firstname}', '${hash_pwd}');`);
    const token = get_token(email);
    return res.json({ token });
});

router.post("/login", async (req, res) => {
    if (middleware.check_body(req, res, ["email", "password"]) == true)
        return res.json({ msg : "Bad parameter"});
    const {email, password} = req.body;
    db.connection.query("USE " + process.env.MYSQL_DATABASE);
    const [data] = await db.connection.query(`SELECT password FROM user WHERE email = '${email}'`);
    const matchPassword = await bcrypt.compare(password, data[0].password);
    if (!matchPassword)
        return res.json({ msg : "Invalid Credentials"});
    const token = get_token(email);
    return res.json({ token });
});

module.exports = router;