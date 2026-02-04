import { Server } from "socket.io"
import {uidTosocket} from "./store/uid.store"
let io;
export const initSockets = (server) => {
    io = new Server(server);
    io.on("connection", (client) => {
        const uid = client.handshake.query.uid;
        uidTosocket[uid] = client.id;
        console.log("Connection request");
        client.on("code_one_vsClient", (obj) => {
            const target = uidTosocket[obj.uid];
            if (target && io.sockets.sockets.has(target)) {
                io.to(target).emit("receive_code", obj.code);
            }
        });
        // for file
        client.on("codeFile", (parcel) => {
            io.to(uidTosocket[parcel.recipientUID]).emit("receiveFile", parcel.parcel);
        });
        // code 
        client.on("codeCodeSnip", (parcel) => {
            io.to(uidTosocket[parcel.recipientUID]).emit("receiveCodeSnip", parcel.parcel);
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