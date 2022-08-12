const express = require("express");
const dotenv = require("dotenv");
const todoRouter = require("./routes/todoRouter");

dotenv.config();

const app = express();

app.use("/todos",todoRouter)
app.listen(process.env.PORT || 3000 , ()=>{
    console.log("server running on port",process.env.PORT);
}) 