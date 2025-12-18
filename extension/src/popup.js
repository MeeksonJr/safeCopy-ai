// extension/src/popup.js
document.getElementById("openScannerButton").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:3000/scanner" });
});

