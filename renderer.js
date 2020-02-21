// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const btnC = document.getElementById('btn');
const validButton = document.getElementById('validButton')
btnC.addEventListener('click', function () {
  var arg = "secondparam";
  document.getElementById("code").innerText = window.ipcRenderer.sendSync('btnClick', 'banana');
});
validButton.addEventListener('click', function() {
  let addTo = document.getElementById('textBox').value;
  console.log(window.ipcRenderer.sendSync('validButton', addTo));
});
