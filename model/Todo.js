const uniqid = require("uniqid");
const sendResponse = require("../middlewares/sendResponse");
const AppError = require("../utils/AppError");
let date = new Date();
let currentDate = date.toLocaleDateString();
let currentTime = date.toLocaleTimeString();

function Todo(description, updatedAt ) {
  if (updatedAt === undefined) {
    updatedAt = 0;
  }

  this.id = `todo-${uniqid()}`;
  this.description = description;
  this.isCompleted = false;
  this.createdAt = `${currentDate} ${currentTime}`;
  this.updatedAt = 0;
  this.isValid =  isValid(description);
}

function isValid (desc){
  console.log("length:",desc.length);
  if(desc.length < 5)
  {
   return false
  }
  return true
}
module.exports = Todo;
