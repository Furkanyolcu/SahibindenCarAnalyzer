from flask import Flask, request, jsonify

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')
    result = f"Metin uzunluğu: {len(text)} karakter"
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)