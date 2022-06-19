const express = require("express");
const router = express.Router();
var db = require("../../config/db");
const env = require("dotenv").config();
const middleware = require("../../middleware/auth")

router.param('id', (req, res, next, id) => {
    const tmp = id;
    req.id = tmp;
    next();
});

router.post("/", middleware.auth_ckeck, async (req, res) => {
    try {
        if (middleware.check_body(req, res, ["title", "description", "due_time", "user_id"]) == true)
            return res.json({ msg : "Bad parameter"});
        var title = req.body['title'];
        var description = req.body['description'];
        var due_time = req.body['due_time'];
        var user_id = req.body['user_id'];
        var status = "not started";
        if (req.body.status)
            status = req.body['status'];
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        await db.connection.query(`
        INSERT INTO todo (title, description, due_time, status, user_id) VALUES ('${title}', '${description}', '${due_time}', '${status}', '${user_id}');
        `);
        res.send({ title, description, due_time, status, user_id });
    } catch {
        res.json({ msg : "Internal server error"})
    }
});

router.get("/", middleware.auth_ckeck, async (req, res) => {
    try {
        db.connection.query("USE epytodo");
        var query = 'SELECT * FROM todo';
        const [response] = await db.connection.query(query);
        res.send(response);
    } catch {
        res.json({ msg : "Internal server error"})
    }
});

router.get("/:id", middleware.auth_ckeck, async (req, res) => {
    try {
        const param_verif = await middleware.is_in_table("todo", "id", req.id);
        if (param_verif != null)
            return res.json({ msg : param_verif });
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        const [[response]] = await db.connection.query(`SELECT * FROM todo where id = ${req.id}`);
        res.send(response);
    } catch {
        res.json({ msg : "Internal server error"})
    }
});

router.put("/:id", middleware.auth_ckeck, async (req, res) => {
    try {
        const param_verif = await middleware.is_in_table("todo", "id", req.id);
        if (param_verif != null)
        return res.json({ msg : param_verif });
        if (await middleware.is_in_table("user", "id", req.body.user_id) != null) {
            return res.json({ msg : "user_id not found" });
        }
        if (middleware.check_body(req, res, ["title", "description", "due_time", "user_id"]) == true)
            return res.json({ msg : "Bad parameter"});
        var title = req.body['title'];
        var description = req.body['description'];
        var due_time = req.body['due_time'];
        var user_id = req.body['user_id'];
        var status = "not started";
        if (req.body.status)
            status = req.body['status'];
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        const query = `UPDATE todo SET title = '${title}',
        description = '${description}', due_time = '${due_time}',
        user_id = '${user_id}', status = '${status}' WHERE id = ${req.id};`
        await db.connection.query(query);
        res.send({ title, description, due_time, user_id, status });
    } catch {
        res.json({ msg : "Internal server error"})
    }
});

router.delete("/:id", middleware.auth_ckeck, async (req, res) => {
    try {
        const param_verif = await middleware.is_in_table("todo", "id", req.id);
        if (param_verif != null)
            return res.json({ msg : param_verif });
        db.connection.query(`USE ${process.env.MYSQL_DATABASE}`);
        await db.connection.query(`DELETE FROM todo WHERE id = ${req.id};`);
        res.send(`Successfully deleted record number : ${req.id}`);
    } catch {
        res.json({ msg : "Internal server error"})
    }
});

module.exports = router;