let currentDescription = "";
let currentCarDetails = {};

const sentimentTranslations = {
  "Çok Olumlu": "Çok Olumlu",
  "Olumlu": "Olumlu", 
  "Nötr": "Nötr",
  "Olumsuz": "Olumsuz",
  "Çok Olumsuz": "Çok Olumsuz"
};

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

function formatPrice(price) {
  if (!price || price === "Tahmin yapılamadı") {
    return "Tahmin yapılamadı";
  }
  
  let cleanPrice = price;
  if (cleanPrice.startsWith('-')) {
    cleanPrice = cleanPrice.substring(1);
  }
  
  const numericPrice = cleanPrice.replace(/[^\d]/g, '');
  if (numericPrice.length <= 3) {
    return cleanPrice;
  }
  
  const shortenedPrice = numericPrice.slice(0, -3);
  const formattedPrice = shortenedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedPrice + " ₺";
}

function displayResults(data) {
  const priceElement = document.querySelector("#pricePrediction .result-value");
  if (data.predicted_price) {
    priceElement.textContent = formatPrice(data.predicted_price);
  } else {
    priceElement.textContent = "Tahmin yapılamadı";
  }

  const sentimentElement = document.getElementById("sentiment");
  if (data.sentiment) {
    sentimentElement.textContent = data.sentiment;
    sentimentElement.className = `result-value ${getSentimentClass(data.sentiment)}`;
  }

  const confidenceElement = document.getElementById("confidence");
  if (data.confidence) {
    confidenceElement.textContent = data.confidence;
  }

  const descLengthElement = document.getElementById("descriptionLength");
  if (data.description_length) {
    descLengthElement.textContent = `${data.description_length} karakter`;
  }

  const summaryElement = document.getElementById("summary");
  if (data.summary) {
    summaryElement.textContent = data.summary;
  }

  document.getElementById("results").style.display = "block";
}

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
        
        document.getElementById("desc").innerText = response.description;
        currentDescription = response.description;
        
        currentCarDetails = response.carDetails;
        document.getElementById("carDetails").innerHTML = formatCarDetails(currentCarDetails);
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