const {Router} = require("express");
const { getAlltodos, getSingleTodo, addTodo, deleteTodo } = require("../controller/todoController");
const todoRouter = Router();
// /todos
todoRouter.route("/").get(getAlltodos).post(addTodo);
todoRouter.route("/:id").get(getSingleTodo).patch().delete(deleteTodo);

module.exports = todoRouter;