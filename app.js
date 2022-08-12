const express = require("express");
const dotenv = require("dotenv");
const todoRouter = require("./routes/todoRouter");
const sendErrorResponse = require("./middlewares/sendErrorResponse");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/todos",todoRouter);

app.use(sendErrorResponse);

app.get("*",(req,res)=>{
    res.status(404).json({message : "Data not found"})
})

app.listen(process.env.PORT || 3000 , ()=>{
    console.log("server running on port",process.env.PORT);
}) 