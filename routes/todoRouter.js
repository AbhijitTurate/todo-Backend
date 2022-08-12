const {Router} = require("express");
const { getAlltodos, getSingleTodo } = require("../controller/todoController");
const todoRouter = Router();
// /todos
todoRouter.route("/").get(getAlltodos).post();
todoRouter.route("/:id").get(getSingleTodo).patch().delete();

module.exports = todoRouter;