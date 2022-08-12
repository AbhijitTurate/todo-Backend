const uniqid = require("uniqid")

function Todo(description , updatedAt){
    if(updatedAt === undefined){
        updatedAt = 0;
    }
    let date = new Date();
    let currentDate = date.toLocaleDateString();
   let currentTime =date.toLocaleTimeString();

    this.id = `todo-${uniqid()}`;
    this.description = description;
    this.isCompleted = false;
    this.createdAt = `${currentDate} ${currentTime}`;
    this.updatedAt =0;
}

module.exports = Todo
