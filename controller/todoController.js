const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
let todos = require("../data/todos.json");
const Todo = require("../model/Todo");
const sendResponse = require("../middlewares/sendResponse");
const AppError = require("../utils/AppError");
const filePath = path.resolve(__dirname, "..", "data", "todos.json");
const util = require("util");
const { isBooleanObject } = require("util/types");

const writeFile = util.promisify(fs.writeFile);
const getAlltodos = (req, res, next) => {
  return sendResponse(req, res, next, {
    statusCode: 200,
    message: "todos list",
    payload: todos,
  });
};

const getSingleTodo = (req, res, next) => {
  // const {
  //   params: { id },
  // } = req;
  // let todo = todos.find((todo) => todo.id === id);
  // if (todo === undefined) {
  //   return next(new AppError(404, `Todo with id ${id} not found`));
  // }
  return sendResponse(req, res, next, {
    statusCode: 200,
    message: "todo found",
    payload: todos[req.todoIndex],
  });
};

const addTodo = async (req, res, next) => {
  const {
    body: { description },
  } = req;
  let todo = new Todo(description);
  let todoId = todo.id;
  console.log("created todo", todo);

  if (!todo.isValid) {
    return next(
      new AppError(500, "todo description should be greater than 5 letters")
    );
  }

  if (todos.find((todo) => todo.description === description)) {
    return next(new AppError(500, "todo task already present"));
  }
  todos.push(todo);
  try {
    await writeFile(filePath, JSON.stringify(todos, null, 2));
    console.log("added todo:");
    return sendResponse(req, res, next, {
      statusCode: 201,
      message: `Todo Added`,
    });
  } catch (err) {
    todos = todos.filter((todo) => {
      return todo.id !== todoId;
    });
    console.log("todo list", todos);
    return sendResponse(req, res, next, {
      statusCode: 500,
      message: "internal error",
    });
  }
};

const deleteTodo = async (req, res, next) => {
  const todoIndex = req.todoIndex;
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  console.log("deleted todo", deletedTodo);
  try {
    await writeFile(filePath, JSON.stringify(todos, null, 2));
    return sendResponse(req, res, next, {
      statusCode: 200,
      message: "todo deleted",
    });
  } catch (err) {
    todos.splice(todoIndex, 0, deletedTodo);
    return sendResponse(req, res, next, {
      statusCode: 500,
      message: "internal write operation",
    });
  }
};

const updateTodo = async (req, res, next) => {
  const { body: updateObject } = req;
  let validKeys = ["description", "isCompleted"];

  let todoIndex = req.todoIndex;
  let todo = todos[todoIndex];
  let todoCopy;
  todoCopy = Object.assign(new Todo(todo.description), todo);

  console.log("todoCopy:", todoCopy);
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString();

  for (key in updateObject) {
    if (validKeys.includes(key)) {
      switch (key) {
        case "description":
          if (updateObject[key].length < 5 || updateObject[key] === todo[key]) {
            console.log("inside if", updateObject[key].length < 5);
            return next(
              new AppError(
                500,
                "todo description Invalid"
              )
            );
          }
          todo[key] = updateObject[key];
          todo.updatedAt = `${currentDate} ${currentTime}`;
          break;
        case "isCompleted":
          if(!(updateObject[key] === "true" || updateObject[key] === "false")){
            console.log("isCompleted:",updateObject[key]);
            console.log("type of isCompleted:",updateObject[key] === "false");
            return next(
              new AppError(
                500,
                "todo isCompleted Invalid"
              )
            );
          }
          todo[key]=updateObject[key];
          todo.updatedAt = `${currentDate} ${currentTime}`;
        break;
        default:
          break;
      }
      console.log("updated todo:", todo);
    }
  }

  try {
    await writeFile(filePath, JSON.stringify(todos, null, 2));
    return sendResponse(req, res, next, {
      statusCode: 200,
      message: "Todo updated sucessfully",
      payload: todo,
    });
  } catch (err) {
    let todoIndex = todos.findIndex(
      (todoElement) => todoElement.id === todo.id
    );
    todos.splice(todoIndex, 1, todoCopy);
    console.log("updated todo", todos);
    return next(new AppError(500, "internal error operation"));
  }
};

module.exports = {
  getAlltodos,
  getSingleTodo,
  addTodo,
  deleteTodo,
  updateTodo,
};
