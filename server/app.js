import dotenv from 'dotenv'
import http from "http";
import initSockets from './socketServer.js';
import  express from "express";
import  path from "path";

dotenv.config(); 
const PORT=process.env.PORT || 8000;
// --
/** *****************🟢 Server Setup Section 🟢*******************/
// --
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



// --
/** *****************🟢 Server Memory Section 🟢*******************/
// --

const users={};        // to map uid (permanent) -> socket-id (temp)
const activeTokens=new Map();
/** *****************🔴 Section END 🔴*******************/


// to handle HTTP requests
app.get('/admin',(req,res)=>{
    res.render("index")
});
app.post('/generate_token',);
app.post('/engage',(req,res)=>{
    const token = req.body.token;
    let user = req.body.user;
    if(!user) user={name:req.body.name,uid:req.body.uid};
    if(activeTokens.has(token)){
        const targetUser=activeTokens.get(token);    // get uid of token_generator_user
        const target_socket_id=users[targetUser.uid];
        if(target_socket_id && io.sockets.sockets.has(target_socket_id)){
            io.to(target_socket_id).emit("newFriend",user);
            res.json({"user":targetUser});
        }
        else res.status(404),json({"error":"No user Found / User is Offline"});
    }else{
        res.status(404).json({"status":"Token Expired"});
    }
});
app.get("/",(req,res)=>{
    res.render("home");
});

app.listen(PORT,()=>{console.log(`Server Started at ${PORT}`)});