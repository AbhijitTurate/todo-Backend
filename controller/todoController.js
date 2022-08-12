const fs= require("fs");
const path = require("path");
const express = require("express");
const app = express();

const getAlltodos = (req,res) => {
    res.status(200).json({message : "Todo list"})
}

module.exports = {getAlltodos};