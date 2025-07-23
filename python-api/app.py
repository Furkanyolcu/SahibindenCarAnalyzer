from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Flask app setup
app = Flask(__name__)
CORS(app)

# 1. Duygu analizi modeli (çok dilli model)
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# 2. Özetleme modeli (genel amaçlı İngilizce özetleyici)
summary_model_name = "sshleifer/distilbart-cnn-12-6"
summary_tokenizer = AutoTokenizer.from_pretrained(summary_model_name)
summary_model = AutoModelForSeq2SeqLM.from_pretrained(summary_model_name)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    description = data.get('description', '')
    car_details = data.get('carDetails', {})

    # 1. Duygu Analizi
    sentiment_result = sentiment_pipeline(description)[0]
    label = sentiment_result["label"]
    score = sentiment_result["score"]

    # Label sadeleştir
    stars = {
        "1 star": "Çok Olumsuz",
        "2 stars": "Olumsuz",
        "3 stars": "Nötr",
        "4 stars": "Olumlu",
        "5 stars": "Çok Olumlu"
    }
    sentiment = stars.get(label, label)

    # 2. Özetleme
    if len(description) < 10:
        summary = description  # çok kısa metinlerde özetleme yapma
    else:
        inputs = summary_tokenizer.encode(description, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = summary_model.generate(inputs, max_length=80, min_length=20, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = summary_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return jsonify({
        "description_length": len(description),
        "sentiment": sentiment,
        "confidence": f"{score * 100:.2f}%",
        "summary": summary,
        "car_details": car_details
    })

if __name__ == '__main__':
    app.run(debug=True)
