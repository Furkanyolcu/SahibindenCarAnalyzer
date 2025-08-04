chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCarData") {
    let descDiv = document.getElementById("classifiedDescription");
    let description = descDiv ? descDiv.innerText.trim() : "Açıklama bulunamadı.";

    function getCarDetails() {
      const details = {};
      const infoLists = document.querySelectorAll('ul.classifiedInfoList, ul[class*="classified"]');
      infoLists.forEach(list => {
        list.querySelectorAll('li').forEach(li => {
          const keyElem = li.querySelector('strong');
          const valueElem = li.querySelector('span');
          if (keyElem && valueElem) {
            const key = keyElem.innerText.trim();
            const value = valueElem.innerText.trim();
            details[key] = value;
          }
        });
      });
      let price = null;
      const priceElem = document.querySelector('h2[data-classified-price], h2[class*="price"], input[name="price"]');
      if (priceElem) {
        price = priceElem.innerText ? priceElem.innerText.trim() : priceElem.value.trim();
      }
      if (price) {
        details['Fiyat'] = price;
      }
      return details;
    }

    const carDetails = getCarDetails();
    try {
      sendResponse({ description, carDetails });
    } catch (e) {
      console.error("sendResponse hatası:", e);
    }
  } else {
    console.log("Bilinmeyen action:", request.action);
  }
});