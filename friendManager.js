// Error Log Code : zZ-300
// TO manage all stuffs realted to Friends List 

/**
 * storage store friendList  as  object
 *  friends = {
 *      uid1:{name:"ABC1",state:"active"},
 *      uid2:{name:"ABC2",state:"blocked"}
 *  }
 */
const vscode=require("vscode");
class FriendManager{
    /**
     * @param {vscode.ExtensionContext} context 
     */
    constructor (context){
        this.context =  context;
        this.friends=new Map();
        this.loadFromStorage();
    }
    // utility function to load data from globalState of extension
    /**
     * Error Code Util1
     */
    loadFromStorage(){
        try{
            const raw_friends = this.context.globalState.get("friends",{});
            this.friends= new Map(Object.entries(raw_friends));
        }
        catch(err){
            console.log(` 🔴 Error code (Snip Share) : zZ-3Util1`);
        }
    }
     // utility function to write data to globalState 
     /**
      * Error Code Util2
      */
    saveToStorage(){
       try{
            const updatedFriends = Object.fromEntries(this.friends.entries());
            this.context.globalState.update("friends",updatedFriends);
       }catch(err){
            console.log(` 🔴 Error code (Snip Share) : zZ-3Util2`);
       }
    }
    /**
     * @returns {Array<{uid:string,name:string}>}
     */
    getAll(){
        return Array.from(this.friends.entries())
        .filter(([uid,data]) =>data.state === "active")
        .map(([uid,data]) => ({uid:uid,name:data.name}));
    }
    /**
     * 
     * @param {string} uid 
     * @returns {Object}
     *      @property {string} name
     *      @property {string} state
     */
    get(uid){
        return this.friends.get(uid);
    }
    /**
     * @returns {Array<{uid:string,name:string}>}
     */
    getBlocked(){
        return Array.from(this.friends.entries())
        .filter(([uid,data]) =>data.state === "blocked")
        .map(([uid,data]) => ({uid:uid,name:data.name}));     // function block so use ()
    }
    /** 
     * @param {string} uid 
     * @param {string} name 
     * @param {"active"|"blocked"} state 
     * 
     */
    add(uid,name,state ="active"){
        if(!this.friends.has(uid)){
            this.friends.set(uid,{name,state});
            this.saveToStorage()
        }
    }
    /**
     * @param {string} uid 
     * @param {{name?:string,state?:string}} data 
     * @returns {boolean}
     */
    update(uid,data){
        if(!this.friends.has(uid)) return false;
        const currentData=this.friends.get(uid);
        this.friends.set(uid,{...currentData,...data});  // field in data(if present) will override fields in currentData
        this.saveToStorage();
        return true;
    }
    /**
     *
     * @param {string} uid 
     * @returns {Boolean}
     */
    remove(uid){
        const deleted= this.friends.delete(uid);
        if(deleted){
            this.saveToStorage();
        }
        return deleted;
    }
    /**
     * @param {string} uid 
     * @returns {Boolean}
     */
    has(uid){
        return this.friends.has(uid);
    }
}
module.exports = FriendManager;