const {Router} = require("express");
const { getAlltodos } = require("../controller/todoController");
const todoRouter = Router();

todoRouter.route("/").get(getAlltodos).post();
todoRouter.route("/:id").get().patch().delete();

module.exports = todoRouter;