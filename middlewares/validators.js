const todos = require("../data/todos.json");
const AppError = require("../utils/AppError");
const sendErrorResponse = require("./sendErrorResponse");

const isAvailable = (req, res , next)=>{

    const{
        params:{id}
    } = req

    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if(todoIndex === -1){
        return next(new AppError(404 ,`todo with id ${id} not found`));
    }
    req.todoIndex = todoIndex;
   next()
}

module.exports = {isAvailable}