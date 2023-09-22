const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Todo = require("../models/todo");

router.post("/todo", asyncHandler(async (req, res, next) => {
    const todo  = new Todo({
        title: req.body.title,
        description: req.body.description
    });

    res.json({todo, message: "Todo Created"});
}));

router.get("/todos", asyncHandler(async(req, res, next) => {
    const todos = await Todo.find().exec();

    res.json(todos);
}));


module.exports = router;