let currentDescription = "";
let currentCarDetails = {};

// Türkçe duygu analizi çevirisi
const sentimentTranslations = {
  "Çok Olumlu": "Çok Olumlu",
  "Olumlu": "Olumlu", 
  "Nötr": "Nötr",
  "Olumsuz": "Olumsuz",
  "Çok Olumsuz": "Çok Olumsuz"
};

// Duygu analizi için CSS sınıfı belirleme
function getSentimentClass(sentiment) {
  const lowerSentiment = sentiment.toLowerCase();
  if (lowerSentiment.includes("olumlu")) {
    return "sentiment-positive";
  } else if (lowerSentiment.includes("nötr") || lowerSentiment.includes("neutral")) {
    return "sentiment-neutral";
  } else if (lowerSentiment.includes("olumsuz")) {
    return "sentiment-negative";
  }
  return "";
}

// Araç detaylarını formatlama
function formatCarDetails(carDetails) {
  if (!carDetails || Object.keys(carDetails).length === 0) {
    return "Araç detayları bulunamadı.";
  }

  const importantFields = [
    "Marka", "Model", "Yıl", "KM", "Yakıt Tipi", "Vites", 
    "Renk", "Kasa Tipi", "Motor Hacmi", "Motor Gücü"
  ];

  let formatted = "";
  importantFields.forEach(field => {
    if (carDetails[field]) {
      formatted += `<strong>${field}:</strong> ${carDetails[field]}<br>`;
    }
  });

  return formatted || "Detaylar yüklenemedi.";
}

// Sonuçları gösterme fonksiyonu
function displayResults(data) {
  // Fiyat tahmini
  const priceElement = document.querySelector("#pricePrediction .result-value");
  if (data.predicted_price) {
    // Negatif değerleri pozitife çevir
    let price = data.predicted_price;
    if (price.startsWith('-')) {
      price = price.substring(1); // Eksi işaretini kaldır
    }
    priceElement.textContent = price;
  } else {
    priceElement.textContent = "Tahmin yapılamadı";
  }

  // Duygu analizi
  const sentimentElement = document.getElementById("sentiment");
  if (data.sentiment) {
    sentimentElement.textContent = data.sentiment;
    sentimentElement.className = `result-value ${getSentimentClass(data.sentiment)}`;
  }

  // Güven oranı
  const confidenceElement = document.getElementById("confidence");
  if (data.confidence) {
    confidenceElement.textContent = data.confidence;
  }

  // Açıklama uzunluğu
  const descLengthElement = document.getElementById("descriptionLength");
  if (data.description_length) {
    descLengthElement.textContent = `${data.description_length} karakter`;
  }

  // Özet
  const summaryElement = document.getElementById("summary");
  if (data.summary) {
    summaryElement.textContent = data.summary;
  }

  // Sonuçları göster
  document.getElementById("results").style.display = "block";
}

// Loading durumunu yönetme
function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("analyzeBtn").disabled = true;
  document.getElementById("results").style.display = "none";
  document.getElementById("error").style.display = "none";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("analyzeBtn").disabled = false;
}

// Hata gösterme
function showError(message) {
  const errorElement = document.getElementById("error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
  hideLoading();
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getCarData" },
      (response) => {
        if (!response) {
          document.getElementById("desc").innerText = "Veri alınamadı!";
          document.getElementById("carDetails").innerText = "Araç detayları alınamadı!";
          console.error("Content script'ten response alınamadı.");
          return;
        }
        
        // Açıklama
        document.getElementById("desc").innerText = response.description;
        currentDescription = response.description;
        
        // Araç detayları
        currentCarDetails = response.carDetails;
        document.getElementById("carDetails").innerHTML = formatCarDetails(currentCarDetails);
        
        console.log("Açıklama metni:", currentDescription);
        console.log("Diğer veriler:", currentCarDetails);
      }
    );
  });

  document.getElementById("analyzeBtn").addEventListener("click", () => {
    showLoading();
    
    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        description: currentDescription, 
        carDetails: currentCarDetails 
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      hideLoading();
      console.log("API Response:", data);
      displayResults(data);
    })
    .catch(error => {
      console.error("API Error:", error);
      showError(`API hatası: ${error.message}`);
    });
  });
});