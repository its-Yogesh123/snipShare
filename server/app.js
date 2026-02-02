require('dotenv').config(); 
const http= require("http");
const express= require("express");
const path=require("path");
const PORT=process.env.PORT;
const app=express();
const {Server}=require("socket.io");
const { json } = require("body-parser");
const server = http.createServer(app);
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
const io=new Server(server)
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// --- Main Memory Storage 
const users={};        // to map uid (permanent) -> socket-id (temp)
const activeTokens=new Map();
io.on("connection",(client)=>{
    //  mapping after connection established
    // client.on("register",(uid)=>{               // mapping new connections with  socket ids
    //     users[uid]=client.id;
    //     console.log(uid);
    // });
    //  mapping during handshake via query
    const uid = client.handshake.query.uid;
    users[uid]=client.id;
    console.log("Connection request");
    client.on("code_one_vsClient",(obj)=>{
        const target=users[obj.uid];
        if(target && io.sockets.sockets.has(target)){
            io.to(target).emit("receive_code",obj.code);
        }
    });
    // for file
    client.on("vscodeSendFile",(parcel)=>{
        io.to(users[parcel.recipientUID]).emit("receiveFile",parcel.parcel);
    });
    // code 
    client.on("vscodeSendCode",(parcel)=>{
        io.to(users[parcel.recipientUID]).emit("receiveCode",parcel.parcel);
    });
});
//  utility function
function generate_Token(){
    let value="ABmnbvcxCDEFzqwertyGHIZKLMNOuioplPQRSTkjhgasdf";
    let token="";
    for(let i=0;i<5;i++){
        token+=  value.charAt(Math.floor((Math.random() * value.length)));
    }
    return token;
}
function activateToken(user){
    // let token = generate_Token();      // do not follow DRY Principle 
    // while(activeTokens.has(token)){
    //     token=generate_Token();
    // }
    let token ;     // this approach follow DRY principle
    do{
        token=generate_Token();     // only one time to write generate_Token function
    }while(activeTokens.has(token));
    const id=setTimeout(()=>{
        activeTokens.delete(token);
    },10*60*1000);
    activeTokens.set(token,user);
    return token;
}

// to handle HTTP requests
app.get('/admin',(req,res)=>{
    res.render("index")
});
app.post('/generate_token',(req,res)=>{
    const {user}=req.body;
    const token=activateToken(user);
    return res.status(200).json({"token":token});
});
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
server.listen(PORT,()=>{console.log(`Server Started at ${PORT}`)});