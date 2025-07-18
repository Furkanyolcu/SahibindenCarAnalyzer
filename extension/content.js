chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getDescription") {
    let descDiv = document.getElementById("classifiedDescription");
    let description = "Açıklama bulunamadı.";
    if (descDiv) {
      // Sadece innerText'i al, alt div aramaya gerek yok!
      description = descDiv.innerText.trim();
    }
    sendResponse({ description });
  }
});