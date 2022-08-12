const {Router} = require("express");
const { getAlltodos, getSingleTodo, addTodo, deleteTodo, updateTodo } = require("../controller/todoController");
const todoRouter = Router();
// /todos
todoRouter.route("/").get(getAlltodos).post(addTodo);
todoRouter.route("/:id").get(getSingleTodo).patch(updateTodo).delete(deleteTodo);

module.exports = todoRouter;