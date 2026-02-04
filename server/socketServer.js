import { Server } from "socket.io"
import {uidTosocket} from "./store/uid.store.js"
let io;
export const initSockets = (server) => {
    io = new Server(server,{
    cors: {
        origin: '*',
    }});
    io.on("connection", (client) => {
        const uid = client.handshake.query.uid;
        uidTosocket[uid] = client.id;
        console.log("Connection request");
        client.on("code_one_vsClient", (obj) => {
            console.log("Send adfasfasdfasdf");
            const target = uidTosocket[obj.uid];
            if (target && io.sockets.sockets.has(target)) {
                io.to(target).emit("receive_code", obj.code);
            }
        });
        // for file
        client.on("codeFile", (parcel) => {
            console.log("Send File");
            io.to(uidTosocket[parcel.recipientUID]).emit("receiveFile", parcel.parcel);
        });
        // code 
        client.on("codeCodeSnip", (parcel) => {
            console.log("Send Code");
            io.to(uidTosocket[parcel.recipientUID]).emit("receiveCode", parcel.parcel);
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