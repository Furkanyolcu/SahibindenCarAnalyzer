let currentDescription = "";
let currentCarDetails = {};

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getCarData" },
      (response) => {
        if (!response) {
          document.getElementById("desc").innerText = "Veri alınamadı!";
          console.error("Content script'ten response alınamadı.");
          return;
        }
        document.getElementById("desc").innerText = response.description;
        currentDescription = response.description;
        currentCarDetails = response.carDetails;
        // Konsola yazdır
        console.log("Açıklama metni:", currentDescription);
        console.log("Diğer veriler:", currentCarDetails);
      }
    );
  });

  document.getElementById("analyzeBtn").addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: currentDescription, carDetails: currentCarDetails })
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