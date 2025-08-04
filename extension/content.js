chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCarData") {
    // Açıklama
    let descDiv = document.getElementById("classifiedDescription");
    let description = descDiv ? descDiv.innerText.trim() : "Açıklama bulunamadı.";

    // Diğer veriler
    function getCarDetails() {
      const details = {};
      // Tüm ilgili <ul> listelerini bul
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
      // Fiyatı ayrıca çek (ör: <h2> veya başka bir yerde olabilir)
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
    console.log("Çekilen açıklama:", description);
    console.log("Çekilen diğer veriler:", carDetails);
    try {
      sendResponse({ description, carDetails });
      console.log("sendResponse çağrıldı.");
    } catch (e) {
      console.error("sendResponse hatası:", e);
    }
  } else {
    console.log("Bilinmeyen action:", request.action);
  }
});