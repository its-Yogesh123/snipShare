
import dotenv from 'dotenv'
import http from "http";
import path from 'path';
import {initSockets} from "./socketServer.js";
import  express from "express";
import {router} from "./routes/routes.js"
/** *****************🟢 Development Section 🟢*******************/
// import { Server } from 'socket.io';
// const app=express();
// const server = http.createServer(app);
// const io = new Server(server);
// io.on("connection",(client)=>{
//     console.log("Connection Request");
// });
// --
/** *****************🟢 Server Setup Section 🟢*******************/
// --
dotenv.config(); 
const PORT=process.env.PORT || 8000;
const app=express();
const server = http.createServer(app);
const io = initSockets(server);

/** *****************🔴 Section END 🔴*******************/

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
// --
/** *****************🟢 Middleware Section 🟢*******************/
// --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',router);

server.listen(PORT,()=>{console.log(`Server Started at ${PORT}`)});