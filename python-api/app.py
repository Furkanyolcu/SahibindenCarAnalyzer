from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import joblib
import pandas as pd
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)

sentiment_pipeline = pipeline("sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment")

summary_id = "sshleifer/distilbart-cnn-12-6"
summary_tokenizer = AutoTokenizer.from_pretrained(summary_id)
summary_model = AutoModelForSeq2SeqLM.from_pretrained(summary_id)

MODEL_URL = "https://huggingface.co/VarunKumarGupta2003/Car-Sale-Prediction/resolve/main/Car-Price-Prediction_model.joblib"
resp = requests.get(MODEL_URL)
price_model = joblib.load(BytesIO(resp.content))

def preprocess_car_data(raw_data):
    year = int(raw_data.get("Yıl", 2000))
    kms = raw_data.get("KM", "0").replace(".", "").replace(",", "")
    kms_driven = int(kms) if kms.isdigit() else 0

    fuel = raw_data.get("Yakıt Tipi", "").lower()
    fuel_type_Diesel = 1 if "dizel" in fuel else 0
    fuel_type_Petrol = 1 if "benzin" in fuel else 0
    fuel_type_CNG = 1 if "lpg" in fuel or "cng" in fuel else 0

    transmission = raw_data.get("Vites", "").lower()
    transmission_Manual = 1 if "manuel" in transmission else 0
    transmission_Automatic = 1 if "otomatik" in transmission else 0

    seller = raw_data.get("Kimden", "").lower()
    seller_type_Individual = 1 if "sahibinden" in seller else 0
    seller_type_Dealer = 1 if "galeriden" in seller or "bayi" in seller else 0

    brand = raw_data.get("Marka", "").lower()
    brand_Maruti = 1 if brand == "maruti" else 0
    brand_Hyundai = 1 if brand == "hyundai" else 0
    brand_Toyota = 1 if brand == "toyota" else 0

    present_price = 1.0

    owner_0 = 0
    owner_1 = 1
    owner_2 = 0
    owner_3 = 0
    owner_4 = 0

    return {
        'year': year,
        'present_price': present_price,
        'kms_driven': kms_driven,
        'fuel_type_Diesel': fuel_type_Diesel,
        'fuel_type_Petrol': fuel_type_Petrol,
        'fuel_type_CNG': fuel_type_CNG,
        'seller_type_Individual': seller_type_Individual,
        'seller_type_Dealer': seller_type_Dealer,
        'transmission_Manual': transmission_Manual,
        'transmission_Automatic': transmission_Automatic,
        'owner_0': owner_0,
        'owner_1': owner_1,
        'owner_2': owner_2,
        'owner_3': owner_3,
        'owner_4': owner_4,
        'brand_Maruti': brand_Maruti,
        'brand_Hyundai': brand_Hyundai,
        'brand_Toyota': brand_Toyota,
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    description = data.get('description', '')
    car = data.get('carDetails', {})

    sent = sentiment_pipeline(description)[0]
    map_labels = {
        "1 star": "Çok Olumsuz",
        "2 stars": "Olumsuz",
        "3 stars": "Nötr",
        "4 stars": "Olumlu",
        "5 stars": "Çok Olumlu"
    }
    sentiment_label = map_labels.get(sent["label"], sent["label"])
    confidence = f"{sent['score'] * 100:.2f}%"

    if len(description) < 10:
        summary = description
    else:
        tokens = summary_tokenizer.encode(description, return_tensors="pt", max_length=1024, truncation=True)
        gen = summary_model.generate(tokens, max_length=80, min_length=20, num_beams=4, early_stopping=True)
        summary = summary_tokenizer.decode(gen[0], skip_special_tokens=True)

    try:
        processed = preprocess_car_data(car)
        df = pd.DataFrame([processed])
        pred = price_model.predict(df)[0]
        predicted_price = f"{pred:,.0f} ₺"
    except Exception as e:
        predicted_price = f"Hata: {e}"

    return jsonify({
        "description_length": len(description),
        "sentiment": sentiment_label,
        "confidence": confidence,
        "summary": summary,
        "predicted_price": predicted_price,
        "car_details": car
    })

if __name__ == '__main__':
    app.run(debug=True)
