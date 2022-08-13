const {Router} = require("express");
const { getAlltodos, getSingleTodo, addTodo, deleteTodo, updateTodo } = require("../controller/todoController");
const { isAvailable } = require("../middlewares/validators");
const todoRouter = Router();
// /todos
todoRouter.route("/").get(getAlltodos).post(addTodo);
todoRouter.route("/:id").get(isAvailable,getSingleTodo).patch(isAvailable,updateTodo).delete(isAvailable,deleteTodo);

module.exports = todoRouter;