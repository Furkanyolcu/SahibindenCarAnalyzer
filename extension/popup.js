let currentDescription = "";

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getDescription" },
      (response) => {
        document.getElementById("desc").innerText = response.description;
        currentDescription = response.description;
      }
    );
  });

  document.getElementById("analyzeBtn").addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: currentDescription })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById("result").innerText = data.result;
      })
      .catch(error => {
        document.getElementById("result").innerText = "API hatası: " + error;
      });
  });
});
console.log("Açıklama metni:", currentDescription);