// file error Log : zZ-200
const vscode = require("vscode");
const fs=require("fs");
const path=require("path");



// utility function

/** Error Code Util1
 * 
 * @returns {string} path
 */
function getCurrentFolderPath() {
    const editor = vscode.window.activeTextEditor;
    if(editor) {
        const filePath = editor.document.uri.fsPath;
        return path.dirname(filePath); // returns the folder of the active file
    }
    else{        // of focus is not on file then currently open root folder will be path
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            return workspaceFolders[0].uri.fsPath;
        }else return null;
    }
}

/**  Error Code Util2
 * 
 * @param {string} fileName 
 * @param {string} folderPath  - for future feature like default path (if no current folder opened)
 */
function getUniquePath(fileName,folderPath=undefined){ 
    try{
        if(!folderPath)folderPath=getCurrentFolderPath();
        if(folderPath){
            const extension = path.extname(fileName);
            const basename=path.basename(fileName,extension);
            let newFilename = fileName;
            let newPath=path.join(folderPath,newFilename);
            let counter=1;
            while(fs.existsSync(newPath)){
                newFilename = `${basename}(${counter})${extension}`;
                newPath=path.join(folderPath,newFilename);
                counter++;
            }
            return newPath; 
        }
        else throw new Error("zZ-2Util2");
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-2Util2`);
    }
}

// main functions 
/** Error code  1
 * 
 * @returns {string} selected text
 */
function getSelectedText() {
    try{
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            return selectedText || null;
        }
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-201`);
    }
}
/** Error Code 2
 * 
 * @returns {Object} - An object containing
 *      @property {string} content  - file data
 *      @property {string} fileName
 *      @property {string} language  - type of file (javascript, python etc...)
 */
function getFile() {
    try{
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            return {
                content : document.getText(),
                fileName:path.basename(document.fileName),
                language : document.languageId
            };
        }
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-202`);
    }
}
/** Error Code 3
 * 
 * @param {string} name 
 * @param {Object} file 
 *      @property {string} content
 *      @property {string} fileName
 *      @property {string} language
 * @param {string} targetFolderPath 
 * @returns 
 */
function createFile(name,file, targetFolderPath=undefined) {
    try{
        if (!file) {
            throw new Error('Invalid file data provided');
            return;
        }
        let fileName = "zZ" + file.fileName;
        const targetPath = getUniquePath(fileName);
        fs.writeFile(targetPath, file.content, 'utf8', (err) => {
            if (err) {
                throw new Error();
            } else {
                vscode.window.showInformationMessage(`${path.basename(targetPath)} - Received From ${name}\nPath : ${targetPath}`);
            }
        });
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-203`);
    }
}
/** Error Code 4
 * 
 * @param {string} name 
 * @param {string} code 
 */
function updateBuffer(name,code) {
    try{
        const folderPath = getCurrentFolderPath();
        if(!folderPath){throw new Error()};           // add default path here
        const bufferPath = path.join(folderPath,"zZbuffer.txt");
        let content =`\n\n ***** Received from ${name} at ${new Date().toLocaleString()}****** \n\n`;
        content+=code;
        fs.appendFile(bufferPath,content, async (err) => {
            if (err) {
            console.error('Error appending to file:', err);
            }else{
                vscode.window.showInformationMessage(`Code from ${name} Save at zZbuffer.txt Path: ${bufferPath}`);
                try {
                    const document = await vscode.workspace.openTextDocument(bufferPath);
                    await vscode.window.showTextDocument(document, { preview: false });
                } catch (error) {
                    console.error('Error opening file in VS Code: 🔴 Error code zZ-204`', error);
                }
            }
        });
    }
    catch(err){
        console.log(` 🔴 Error code (Snip Share) : zZ-204`);
    }
}
module.exports = {getSelectedText,getFile,createFile,updateBuffer};