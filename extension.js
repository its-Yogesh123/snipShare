"use strict"
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {v4:uuid}=require("uuid")
const FriendManager = require("./friendManager");
const backend = require("./toServer");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// global data initialization
	const globalState=context.globalState;
	const URL = "https://snipshare.yolab.in";     // main path of websocket connection
	const tokenURL="https://snipshare.yolab.in/generate_token";
	const makeFriendURL="https://snipshare.yolab.in/engage";
	let uid=globalState.get("snipShare_uid");
	let uName = globalState.get("snipare_uName");
	// globalState.update("friends",undefined);                                         // for extension testing
	const friendManager = new FriendManager(context);     // friend list
	// generate new UID id not exists
	if(!uid){
		uid = uuid();
		globalState.update("snipShare_uid",uid);
	}
	//  Connections to backend
	backend.connectToServer(URL,uid,friendManager);
	// commands 
	const makeFriendCommand = vscode.commands.registerCommand("snipare.makeFriend",async ()=>{
		if(!uName){
			const value = await vscode.window.showInputBox({placeHolder:"Your Name",prompt:"This Name will be your Username and shown to others"});
			uName=value;
			if(uName)globalState.update("snipare_uName",value);
		}
		const options=[
			{label :"New",key:0,description:"Generate Bro Code"},
			{label :"Enter",key:1,description:"Enter Bro Code"}
		];
		const selected_option=await vscode.window.showQuickPick(options,{
			placeHolder:"Make Friends"
		});
		if(selected_option.key ==0){
			backend.generateToken(tokenURL,{uid:uid,name:uName});
		}
		else if(selected_option.key == 1){
			vscode.window.showInputBox().then(token =>{
				backend.makeFriend(makeFriendURL,token,{uid:uid,name:uName},friendManager);
			});
		}
	});
	const blockFriendCommanad = vscode.commands.registerCommand("snipare.blockFriend",async ()=>{
		const array = friendManager.getAll().map(element =>{
				return {label :`🟢 ${element.name}` , description:element.uid};
			});
			const friends_uid = await vscode.window.showQuickPick(array,{placeHolder:"Select Users To Block",canPickMany:true}) || [];
			friends_uid.forEach((friend)=>{
				friendManager.update(friend.description,{state:"blocked"});
			});
	});
	const unblockFriendCommanad = vscode.commands.registerCommand("snipare.unblockFriend",async()=>{
		const array = friendManager.getBlocked().map(element =>{
			return {label :`🔴 ${element.name}` , description:element.uid};
		});
		const selectedUIDs = await vscode.window.showQuickPick(array,{placeHolder:"Select Users To Block",canPickMany:true}) || [];
		selectedUIDs.forEach((friend)=>{
			friendManager.update(friend.description,{state:"active"});
		});
	});
	const changeNameCommand = vscode.commands.registerCommand("snipare.changeName",async ()=>{
		const array = friendManager.getAll().map(element =>{
			return {label :element.name , description:element.uid};
		});
		const friend = await vscode.window.showQuickPick(array,{placeHolder:"Select Friend To Change Name",canPickMany:false}) || [];
		const newName = await vscode.window.showInputBox({placeHolder:"Enter Name"});
		// @ts-ignore
		if(friend && newName)friendManager.update(friend.description,{name:newName});
	});
	const sendFileCommand = vscode.commands.registerCommand("snipare.sendFile",()=>{
		backend.sendFile(friendManager);
	});
	const sendCodeCommand = vscode.commands.registerCommand("snipare.sendCode",()=>{
		backend.sendCode(friendManager);
	});
	// commands 
	backend.registerCommands(context);
	context.subscriptions.push(makeFriendCommand);
	context.subscriptions.push(blockFriendCommanad);
	context.subscriptions.push(unblockFriendCommanad);
	context.subscriptions.push(changeNameCommand);
	context.subscriptions.push(sendFileCommand);
	context.subscriptions.push(sendCodeCommand);
}

function deactivate() {}
module.exports = {
	activate,
	deactivate
}
