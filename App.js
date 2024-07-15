const express =require("express");
const app = express();
const Router=require("./Router")
require("dotenv").config()
const bodyParser=require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/",Router)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
}); 