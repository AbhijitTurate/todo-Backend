const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
let todos = require("../data/todos.json");
const Todo = require("../model/Todo");
const sendResponse = require("../middlewares/sendResponse");
const AppError = require("../utils/AppError");
const sendErrorResponse = require("../middlewares/sendErrorResponse");
const filePath = path.resolve(__dirname, "..", "dat", "todos.json");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const getAlltodos = (req, res, next) => {
  return sendResponse(req, res, next, {
    statusCode: 200,
    message: "todos list",
    payload: todos,
  });
  // res.status(200).json({ message: " todo found", data: todos });
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

  console.log("description", description);
  let todo = new Todo(description);
  let todoId = todo.id;
  console.log("created todo", todo);
  if (todos.find((todo) => todo.description === description)) {
    return next(new AppError(404, "todo task already present"));
  }
  todos.push(todo);

  try {
    console.log("filepath:", filePath);
    await writeFile(filePath, JSON.stringify(todos, null, 2));
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

  return sendResponse(req, res, next, {
    statusCode: 201,
    message: "todo Added",
  });
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

  let validKeys = ["description"];
 
  let todoIndex= req.todoIndex;
  console.log("index",todoIndex);
  let todo = todos[todoIndex];
  console.log("Todo", todo);
  let todoCopy;
  console.log("updateObject",updateObject.description);
  if(updateObject.description){
    todoCopy = Object.assign(new Todo(todo.description), todo);
  }
 
  console.log("Type of todoCopy:", todoCopy);
  let date = new Date();
  let currentDate = date.toLocaleDateString();
  let currentTime = date.toLocaleTimeString();
  for (key in updateObject) {
    if (validKeys.includes(key)) {
      todo[key] = updateObject[key];
      todo.updatedAt = `${currentDate} ${currentTime}`;
      console.log("updated todo:",todo);
    }
   
  }

  try {
    await writeFile(filePath, JSON.stringify(todos, null, 2));
    return sendResponse(req, res, next, {
      statusCode: 200,
      message: "User updated sucessfully",
      payload: todo,
    });
  } catch (err) {
    // todo =  {...todoCopy};
    
    let todoIndex = todos.findIndex(
      (todoElement) => todoElement.id === todo.id
    );
    todos.splice(todoIndex, 1, todoCopy);
    console.log("updated todo",todos );
    // console.log("checking if two have same reference", Object.is(todo , todoCopy));
    // console.log("todos after replacing updated todo", todos);
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
