import { Server } from "socket.io"
const initSockets = (server) => {
    const io = new Server(server);
    io.on("connection", (client) => {
        const uid = client.handshake.query.uid;
        users[uid] = client.id;
        console.log("Connection request");
        client.on("code_one_vsClient", (obj) => {
            const target = users[obj.uid];
            if (target && io.sockets.sockets.has(target)) {
                io.to(target).emit("receive_code", obj.code);
            }
        });
        // for file
        client.on("codeFile", (parcel) => {
            io.to(users[parcel.recipientUID]).emit("receiveFile", parcel.parcel);
        });
        // code 
        client.on("codeCodeSnip", (parcel) => {
            io.to(users[parcel.recipientUID]).emit("receiveCodeSnip", parcel.parcel);
        });
    });
    return io;
};
export default initSockets;