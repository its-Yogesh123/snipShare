//  store all tokens
import {getIO} from "../socketServer.js"
import {activeTokens} from "../store/token.store.js"
import {uidTosocket} from "../store/uid.store.js"
/********************Section End************ */

/******************** Utility function ******************* */
function generateToken(){
    let value="ABmnbvcxCDEFzqwertyGHIZKLMNOuioplPQRSTkjhgasdf";
    let token="";
    for(let i=0;i<5;i++){
        token+=  value.charAt(Math.floor((Math.random() * value.length)));
    }
    return token;
}

function activateToken(user){
    let token;     // this approach follow DRY principle
    do{
        token=generateToken();     // only one time to write generate_Token function
    }while(activeTokens.has(token));

    const id=setTimeout(()=>{
        activeTokens.delete(token);
    },5*60*1000);
    activeTokens.set(token,user);
    return token;
}
/******************** Section End ******************* */


export const createNewToken = (req,res)=>{
    console.log("Token Generation Request received !!! ");
    const {user}=req.body;
    const token=activateToken(user);
    return res.status(200).json({"token":token});
}

export const makeFriend = (req,res)=>{
    console.log("Token Generation Request received !!! ");
    const body = req.body;
    const token = body.token;
    let user = body.user;
    const io = getIO();
    if(!user) user={name:body.name,uid:body.uid};
    if(activeTokens.has(token)){
        const targetUser=activeTokens.get(token);    // get user which have generated the token
        const target_socket_id=uidTosocket[targetUser.uid];
        if(target_socket_id && io.sockets.sockets.has(target_socket_id)){
            io.to(target_socket_id).emit("newFriend",user);
            res.status(200).json({"user":targetUser});
        }
        else res.status(404).json({"error":"No user Found / User is Offline"});
    }else{
        res.status(404).json({"status":"Token Expired"});
    }
}

