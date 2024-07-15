const express=require("express")
const Router=express.Router()
const path = require('path');
const controller=require("./OpenAIController.js")
Router.get("/",(req,res)=>{res.sendFile(path.join(__dirname, 'index.html'))})
Router.get("/generateStory",(req,res)=>{res.sendFile(path.join(__dirname, 'generateStory.html'))})
Router.get("/results",(req,res)=>{res.sendFile(path.join(__dirname, 'results.html'))})
Router.post("/generate",controller.generateStory)
Router.get("/script.js",(req,res)=>{res.sendFile(path.join(__dirname, 'script.js'))})
Router.post("/generatePhoto",controller.generatePhoto)
module.exports=Router