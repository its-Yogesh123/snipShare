import dotenv from 'dotenv'
import http from "http";
import {initSockets} from "./socketServer";
import  express from "express";
import  path from "path";

/** *****************🟢 Development Section 🟢*******************/

// --
/** *****************🟢 Server Setup Section 🟢*******************/
// --
dotenv.config(); 
const PORT=process.env.PORT || 8000;
const app=express();
const server = http.createServer(app);
const io = initSockets(server)

/** *****************🔴 Section END 🔴*******************/

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

// --
/** *****************🟢 Middleware Section 🟢*******************/
// --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes

app.get('/admin',(req,res)=>{
    res.render("index")
});
app.get("/",(req,res)=>{
    res.render("home");
});
app.listen(PORT,()=>{console.log(`Server Started at ${PORT}`)});