// Error Log Code zZ-400
const {io}=require("socket.io-client");
const axios=require("axios");
const vscode=require("vscode");
const fileManager = require("./fileManager");
let socket=null;
// ----- global varibales
let currentStatusBarItem;      // to handle statusBarObject Overhead (if token generated again before timeout)
let latestToken;

// utility function
/**
 * 
 * @param {Object} friendManager 
 * @returns Promise<Array<string>>        // because we are usign async-await
 */
async function getSelectedFriends(friendManager){
    try{
        const array = friendManager.getAll().map(element =>{
            return {label :element.name , description:element.uid};
        });
        const friends_uid = await vscode.window.showQuickPick(array,{placeHolder:"Select Users",canPickMany:true}) || [];
        // @ts-ignore
        return friends_uid.map((selected) => selected.description);    // must ()
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-4Util1`);
    }
}
// http Server handling
/** Error Code 1
 * 
 * @param {string} url 
 * @param {Object} user 
 *      @property {string} name
 *      @property {string} uid
 */
function generateToken(url,user){
		axios.post(url,{"user" : user})
		.then((parcel)=>{
            latestToken=parcel.data.token;
			vscode.window.showInformationMessage(`Token Generated : ${latestToken} valid for 10 minutes`)
            if(currentStatusBarItem) currentStatusBarItem.dispose();
            currentStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
            currentStatusBarItem.text = `Snipare Token : ${latestToken}`;
            currentStatusBarItem.tooltip = 'Click To Copy';
            currentStatusBarItem.show();
            currentStatusBarItem.command = 'snipare.copyToken';  
            setTimeout(()=>{               // remove token after expiring time (10 Min)
                currentStatusBarItem.dispose();
            },5*60*1000);
		})
		.catch(err =>{
			vscode.window.showErrorMessage(`Token Generation Failed!!!! | Error Code zZ-401` );
            console.log(` 🔴 Error code (Snip Share) : zZ-401`);
		});
}
/** Error Code 2
 * 
 * @param {string} URL 
 * @param {string} token 
 * @param {Object} user 
 *      @property {string} name
 *      @property {string} uid
 * @param {Object} friendManager 
 */
function makeFriend(URL,token,user,friendManager){
		axios.post(URL,{token : token,user:user})
		.then((parcel)=>{
            const friend=parcel.data.user;
            friendManager.add(friend.uid,friend.name);
            vscode.window.showInformationMessage(`New Friend ${friend.name}`);
		})
		.catch(err =>{
			vscode.window.showErrorMessage(`Error zZ-402`);
            console.log(` 🔴 Error code (Snip Share) : zZ-402`);
		});
}
// websocket connetions handling
// 
/** Error Code 
 * 
 * @param {string} url 
 * @param {string} uid 
 * @param {Object} friendManager 
 */
function connectToServer(url,uid,friendManager){
    socket=io(url,{query:{uid:uid}});
    // socket.on("connect",()=>{
    //     vscode.window.showInformationMessage(`Connected ${socket.id}`);
    // });
    socket.on("receiveFile",(parcel)=>{       // parcel is {uid,file}
        const sender = friendManager.get(parcel.uid);
        if(sender.state === "active" )fileManager.createFile(sender.name,parcel.file);
    });
    socket.on("receiveCode",(parcel)=>{       // parcel is {uid,text}
        const sender = friendManager.get(parcel.uid);
        if(sender.state === "active" )fileManager.updateBuffer(sender.name,parcel.code);
    });
    socket.on("newFriend",(user)=>{
        if(!friendManager.has(user.uid)){
            friendManager.add(user.uid,user.name);
            vscode.window.showInformationMessage(`New Friend Connected ${user.name}`);
        }
        else{
            friendManager.update(uid,{name:user.name});
        }
    });
    socket.on('disconnect', () => {
        console.log('Connection Lost');
    });
    socket.on('error', (error) => {
        console.error(' 🔴 Socket.IO connection error: Server404', error);
    });
}
/** Error Code 3
 * 
 * @param {Object} friendManager 
 */
async function sendCode(friendManager){
    try{
        const code = fileManager.getSelectedText();
        if(code){
            const friends = await getSelectedFriends(friendManager);
            friends.forEach(uid => {
                socket.emit("vscodeSendCode",{uid:uid,code:code});
        });
    }
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-403`);
    }
}
/** Error Code 4
 * 
 * @param {Object} friendManager 
 */
async function sendFile(friendManager){
   try{
        const friends = await getSelectedFriends(friendManager);
        const file = fileManager.getFile();
        friends.forEach(uid => {
            socket.emit("vscodeSendFile",{uid:uid,file:file});
        });
   }catch(err){
    console.log(` 🔴 Error code (Snip Share) : zZ-404`);
   }
}
// commands 
/** Error Code 5
 * 
 * @param {vscode.ExtensionContext} context 
 */
function registerCommands(context) {
   try{
        const copyTokenCommand = vscode.commands.registerCommand("snipare.copyToken", () => {
        if (latestToken) {
            vscode.env.clipboard.writeText(latestToken);
            vscode.window.showInformationMessage("Token copied!");
        } else {
            vscode.window.showWarningMessage("No token available to copy.");
        }
    });
    context.subscriptions.push(copyTokenCommand);
   }catch(err){
    console.log(` 🔴 Error code (Snip Share) : zZ-405`);
   }
}
module.exports={connectToServer,sendCode,sendFile,generateToken,makeFriend,registerCommands};