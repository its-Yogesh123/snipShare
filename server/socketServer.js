import { Server } from "socket.io"
import {uidTosocket} from "./store/uid.store.js"
import {msgQueue} from "./store/data.store.js"
let io;
export const initSockets = (server) => {
    io = new Server(server,{
    cors: {
        origin: '*',
    }});
    io.on("connection", (client) => {
        const uid = client.handshake.query.uid;
        uidTosocket.set(uid,client.id);
        console.log("Connection request");
        if(msgQueue.has(uid)){
            const data = msgQueue.get(uid);
            io.to(client.id).emit(data.method,data.parcel);
            msgQueue.delete(uid);
            console.log("Pending Message gone!!!!!");
        }else{console.log("No Pending Message");}
        
        client.on("code_one_vsClient", (obj) => {
            const target = uidTosocket.get(obj.uid);
            if (target && io.sockets.sockets.has(target)) {
                io.to(target).emit("receive_code", obj.code);
            }
        });
        // for file
        client.on("codeFile", (parcel) => {
            console.log("Send File");
            const recipientUID = parcel.recipientUID
            const recipientSocket = uidTosocket.get(recipientUID);
            if(recipientSocket && io.sockets.sockets.has(recipientSocket)){
                io.to(recipientSocket).emit("receiveFile", parcel.parcel);
            }else{
                // message queue logic
                console.log("data goes to Message Queue");
                msgQueue.set(recipientUID,{'parcel':parcel.parcel,"method":"receiveFile"});
            }
        });
        // code receiveCode
        client.on("codeCodeSnip", (parcel) => {
            console.log("Send Code");
            const recipientUID = parcel.recipientUID
            const recipientSocket = uidTosocket.get(recipientUID);
            if(recipientSocket && io.sockets.sockets.has(recipientSocket)){
                io.to(recipientSocket).emit("receiveCode", parcel.parcel);
            }else{
                // message queue logic
                console.log("data goes to Message Queue");
                msgQueue.set(recipientUID,{'parcel':parcel.parcel,"method":"receiveCode"});
            }
        });
    });
    return io;
};

export const getIO =()=>{
    if(!io){
        throw new Error();
    }
    else return io;
};