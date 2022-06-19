const express = require("express");
const { route } = require("express/lib/application");
const req = require("express/lib/request");
const router = express.Router();
const db = require("../../config/db")
const middleware = require("../../middleware/auth")
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");

router.param("id", (req, res, next, id) => {
    const tmp = id;
    req.id = id;
    next();
});

router.get("/", middleware.auth_ckeck, async (req, res) => {
    try {
        await db.connection.query("USE epytodo");
        var query = 'SELECT * FROM user';
        const [[response]] = await db.connection.query(query)
        res.json(response);
    } catch (err) {
        res.json({ msg : "Internal server error"});
    }
});

router.get("/todos", middleware.auth_ckeck, async (req, res) => {
    try {
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        const [response] = await db.connection.query("SELECT * FROM todo");
        res.send(response);
    } catch (err) {
        res.json({ msg : "Internal server error"});
    }
});

router.get("/:id", middleware.auth_ckeck ,async (req, res) => {
    try {
        const email_verif = await middleware.is_in_table("user", "email", req.id);
        const id_verif = await middleware.is_in_table("user", "id", req.id);
        if (id_verif != null && email_verif != null)
            return res.json({ msg : id_verif });
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        if (id_verif == null) {
            const [response] = await db.connection.query(`SELECT * FROM user where id = ${req.id}`);
            return res.send(response);
        } else {
            const [response] = await db.connection.query(`SELECT * FROM user where email = '${req.id}'`);
            return res.send(response);
        }
    } catch (err) {
        res.json({ msg : "Internal server error"});
    }
});

router.put("/:id", middleware.auth_ckeck, async (req, res) => {
    try {
        const param_verif = await middleware.is_in_table("user", "id", req.id);
        if (param_verif != null)
            return res.json({ msg : param_verif });
        if (middleware.check_body(req, res, ["name", "email", "password", "firstname"]) == true)
            return res.json({ msg : "Bad parameter"});
        var name = req.body['name'];
        var email = req.body['email'];
        var password = req.body['password'];
        var firstname = req.body['firstname'];
        const hash_pwd = bcrypt.hashSync(password, 10);
        password = hash_pwd;
        await db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        const query = `UPDATE user SET email = '${email}',
        password = '${password}', firstname = '${firstname}',
        name = '${name}' WHERE id = ${req.id};`
        await db.connection.query(query);
        const [[response]]   = await db.connection.query(`SELECT * FROM user WHERE id = ${req.id}`);
        res.send(response);
    } catch (err) {
        res.json({ msg : "Internal server error"});
    }
});

router.delete("/:id", middleware.auth_ckeck, async (req, res) => {
    try {
        const param_verif = await check.is_in_table("user", "id", req.id);
        if (param_verif != null)
            return res.json({ msg : param_verif });
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        await db.connection.query(`DELETE FROM user WHERE id = ${req.id};`);
        res.send(`Successfully deleted record number : ${req.id}`);
    } catch (err) {
        res.json({ msg : "Internal server error"});
    }
});

module.exports = router;