// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, webContents} = require('electron')
const path = require('path')
const fs = require('fs');
const axios = require('axios');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//mainWindow.webContents.executeJavaScript("document.getElementById('test').innerHTML('AHHH');", false);

let codesList;
let charArray;
let printOut;
let togetherCodes = '';
ipcMain.on("btnClick", function (event, arg) {
  console.log("Main recieved click message!");
  codesList = fs.readFileSync('./Codes.txt', 'utf8').split("\r\n");
  codesList = codesList.filter((el) => {
    return el != '';
  });
  printOut = 'Nothing found.';
  console.log(codesList);
  for (let i = 0; i < codesList.length; i++) {
    if (codesList[i].charAt(0) == "$") {
      continue;
    }
    if (codesList[i].charAt(0) == "#") {
      console.log("Found valid code")
      printOut = codesList[i].slice(1);
      codesList[i] = "$" + printOut;
      console.log(printOut);
      togetherCodes = codesList.join('\r\n');
      console.log(togetherCodes);
      fs.writeFileSync('./Codes.txt', togetherCodes.toString());
      let succ = 'Faliure.';
      axios.post('https://maker.ifttt.com/trigger/code_used/with/key/h737ial9G8oAHEugYmy4-tQVa30FyitqKdLTAY2LE-I', {
        value1: printOut
      });
      break;
    }
  }
  if (printOut === 'Nothing found.') {
    axios.post('https://maker.ifttt.com/trigger/code_failed/with/key/h737ial9G8oAHEugYmy4-tQVa30FyitqKdLTAY2LE-I');
  }
  event.returnValue = printOut;
})
ipcMain.on("validButton", function (event, input) {
  let inputValids = input;
  console.log(input)
  inputValids = inputValids.split('\n');

  inputValids = inputValids.filter((el) => el != '');
  console.log(inputValids);
  for (let i = 0; i < inputValids.length; i++) {
    inputValids[i] = "#" + inputValids[i];
  }
  let fileRead = fs.readFileSync('./Codes.txt', 'utf8').split("\r\n");
  for (let i = 0; i < inputValids.length; i++) {
    fileRead.push(inputValids[i]);
  }
  fileRead.filter((el) => el != '');
  let allValids = '';
  for (let i = 0; i < fileRead.length; i++) {
    allValids += fileRead[i] + "\r\n";
  }
  console.log(allValids);
  fs.writeFileSync('./Codes.txt', allValids);
  event.returnValue = 'oops';
});
