// extension/src/content.ts

/// <reference types="chrome" />

console.log("SafeCopy AI Content Script Loaded");

let ghostButton: HTMLButtonElement | null = null;
let resultDisplay: HTMLDivElement | null = null;

interface AnalyzeContentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

function createResultDisplay() {
  if (!resultDisplay) {
    resultDisplay = document.createElement("div");
    Object.assign(resultDisplay.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      width: "300px",
      maxHeight: "400px",
      overflowY: "auto",
      backgroundColor: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: "10001",
      padding: "15px",
      fontSize: "14px",
      color: "#333",
      display: "none",
    });
    document.body.appendChild(resultDisplay);
  }
  return resultDisplay;
}

function showResultDisplay(data: any) {
  const display = createResultDisplay();
  display.innerHTML = `
    <h3 style="margin-top: 0; font-size: 1.1em; color: #2563eb;">SafeCopy AI Analysis</h3>
    <p style="margin-bottom: 8px;"><strong>Safety Score:</strong> ${data.safetyScore}/100</p>
    <p style="margin-bottom: 8px;"><strong>Risk Level:</strong> <span style="color: ${data.riskLevel === 'safe' ? '#10B981' : data.riskLevel === 'warning' ? '#EAB308' : '#EF4444'}; font-weight: bold;">${data.riskLevel.toUpperCase()}</span></p>
    <p style="margin-bottom: 8px;"><strong>Overall Assessment:</strong> ${data.overallAssessment}</p>
    ${data.flags.length > 0 ? `
      <h4 style="margin-top: 15px; margin-bottom: 10px; font-size: 1em; color: #555;">Flagged Issues:</h4>
      <ul style="list-style-type: none; padding: 0;">
        ${data.flags.map((flag: any) => `
          <li style="margin-bottom: 10px; padding-left: 10px; border-left: 3px solid ${flag.type === 'high' ? '#EF4444' : flag.type === 'medium' ? '#EAB308' : '#2563eb'};"><strong style="color: #555;">${flag.text}:</strong> ${flag.reason}</li>
        `).join('')}
      </ul>
    ` : '<p style="margin-top: 15px;">No specific issues found.</p>'}
    <button id="closeResultDisplay" style="margin-top: 15px; background-color: #6B7280; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
  `;
  display.style.display = "block";

  document.getElementById("closeResultDisplay")?.addEventListener("click", () => {
    hideResultDisplay();
  });
}

function hideResultDisplay() {
  if (resultDisplay) {
    resultDisplay.style.display = "none";
  }
}

function createGhostButton(selectedText: string) {
  if (!ghostButton) {
    ghostButton = document.createElement("button");
    Object.assign(ghostButton.style, {
      position: "absolute",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      zIndex: "10000",
      fontSize: "12px",
      display: "none", // Initially hidden
    });
    document.body.appendChild(ghostButton);

    ghostButton.addEventListener("click", () => {
      ghostButton!.textContent = "Analyzing...";
      ghostButton!.disabled = true;
      chrome.runtime.sendMessage({ action: "analyzeContent", content: selectedText }, (response: AnalyzeContentResponse) => {
        if (response.success) {
          showResultDisplay(response.data);
        } else {
          alert(`Error analyzing content: ${response.error}`);
        }
        hideGhostButton();
      });
    });
  }
  return ghostButton;
}

function showGhostButton(x: number, y: number, selectedText: string) {
  const button = createGhostButton(selectedText);
  Object.assign(button.style, {
    left: `${x}px`,
    top: `${y}px`,
    display: "block",
  });
  button.textContent = `Analyze "${selectedText.substring(0, 20)}..."`;
  button.disabled = false;
}

function hideGhostButton() {
  if (ghostButton) {
    ghostButton.style.display = "none";
  }
}

document.addEventListener("mouseup", (event) => {
  const selectedText = window.getSelection()?.toString().trim();
  if (selectedText && selectedText.length > 0) {
    showGhostButton(event.pageX + 10, event.pageY + 10, selectedText);
  } else {
    hideGhostButton();
  }
});


