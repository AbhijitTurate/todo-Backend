const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
let todos = require("../data/todos.json");
const Todo = require("../model/Todo")
const sendResponse = require("../middlewares/sendResponse");
const AppError = require("../utils/AppError");
const sendErrorResponse = require("../middlewares/sendErrorResponse");
const filePath = path.resolve(__dirname , ".." , "data" , "todos.json")
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
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
    params: { id }
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

const addTodo = async (req , res , next) =>{
  const {
    body : {description}
  } = req;

  console.log("description", description);
  let todo = new Todo(description);
  let todoId = todo.id;
  console.log("created todo",todo);
  if(todos.find((todo)=> todo.description === description)){
    return next(new AppError(404 , "todo task already present"))
  }
  todos.push(todo);
 
  try{
    console.log("filepath:",filePath);
    await writeFile(filePath,JSON.stringify(todos , null ,2) );
   
  }
  catch(err){
  todos = todos.filter((todo) => {
    console.log("todo ID:",todo.id);
    console.log("recieved todoID",todoId);
    return todo.id !== todoId
  })
  console.log("todo list",todos);
    return sendResponse(req , res , next ,{statusCode: 500 ,message: "internal error" });
  }

  return sendResponse(req , res , next ,{statusCode: 200 ,message: "todo Added" });
}

module.exports = { getAlltodos , getSingleTodo , addTodo};
