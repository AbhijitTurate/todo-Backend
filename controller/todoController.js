const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const todos = require("../data/todos.json");
const sendResponse = require("../middlewares/sendResponse");
const AppError = require("../utils/AppError");

const getAlltodos = (req, res, next) => {
  return sendResponse(req, res, next,
    {
      statusCode : 200,
      message : "todos list",
      payload: todos
    })
  // res.status(200).json({ message: " todo found", data: todos });
};

const getSingleTodo = (req, res,next) => {
  const {
    params: { id },
  } = req;
  let todo = todos.find((todo) => todo.id === id);
  if (todo === undefined) {
    return next(new AppError(404 , `Todo with id ${id} not found`))
  }
  return sendResponse(req, res, next,
    {
      statusCode : 200,
      message : "todo found",
      payload: todo
    })

};

module.exports = { getAlltodos , getSingleTodo};
