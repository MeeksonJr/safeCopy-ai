// extension/src/background.ts

/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log("SafeCopy AI Extension installed.");
});

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  // Open a new tab with your scanner application
  chrome.tabs.create({ url: "http://localhost:3000/scanner" });
});

interface AnalyzeContentRequest {
  action: "analyzeContent";
  content: string;
}

interface AnalyzeContentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

chrome.runtime.onMessage.addListener(
  (request: AnalyzeContentRequest, sender: chrome.runtime.MessageSender, sendResponse: (response?: AnalyzeContentResponse) => void) => {
    if (request.action === "analyzeContent") {
      fetch("http://localhost:3000/api/extension/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: request.content }),
      })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data: data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
      return true;  // Indicates that the response will be sent asynchronously
    }
  }
);

