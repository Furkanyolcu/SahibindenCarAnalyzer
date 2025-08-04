# SahibindenCarAnalyzer

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/HuggingFace-FF6B6B?style=for-the-badge&logo=huggingface&logoColor=white" alt="HuggingFace">
  <img src="https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Extension">
</div>

## 🚗 Proje Hakkında

SahibindenCarAnalyzer, Sahibinden.com araç ilanlarını analiz eden ve fiyat tahmini yapan gelişmiş bir Chrome uzantısıdır. Bu proje, yapay zeka modellerini kullanarak araç açıklamalarını analiz eder, duygu analizi yapar ve araç özelliklerine göre fiyat tahmini sunar.

## ✨ Özellikler

-  **Otomatik Veri Çekme**: Sahibinden.com ilan sayfalarından otomatik veri çekme
-  **Duygu Analizi**: İlan açıklamalarının duygu analizi
-  **Fiyat Tahmini**: Araç özelliklerine göre fiyat tahmini
-  **Özet Çıkarma**: Uzun açıklamaları özetleme
-  **Güven Oranı**: Analiz sonuçlarının güvenilirlik oranı
-  **Modern Arayüz**: Kullanıcı dostu ve modern tasarım

## 📝 Kullanılan Teknolojiler

- **Frontend**: JavaScript, HTML5, CSS3
- **Backend**: Python, Flask
- **AI/ML**: HuggingFace Transformers
- **Browser Extension**: Chrome Extension API
- **Data Processing**: Natural Language Processing (NLP)

## 📦 Kurulum

### Gereksinimler
- Google Chrome tarayıcısı
- Python 3.8+
- pip (Python paket yöneticisi)

### Adım 1: Projeyi İndirin
```bash
git clone https://github.com/kullaniciadi/SahibindenCarAnalyzer.git
cd SahibindenCarAnalyzer
```

### Adım 2: Python Bağımlılıklarını Yükleyin
```bash
cd python-api
pip install -r requirements.txt
```

### Adım 3: API Sunucusunu Başlatın
```bash
python app.py
```

### Adım 4: Chrome Uzantısını Yükleyin

1. Chrome tarayıcınızda `chrome://extensions/` adresine gidin
2. Sağ üst köşedeki **"Geliştirici modu"**nu etkinleştirin
3. **"Paketlenmemiş öğe yükle"** butonuna tıklayın
4. Proje klasöründeki `extension` klasörünü seçin
5. Uzantı başarıyla yüklenecektir

## 🔍 Kullanım

1. Sahibinden.com'da herhangi bir araç ilanına gidin
2. Chrome uzantı çubuğundaki **CarAnalyzer** ikonuna tıklayın
3. **"Analiz Et"** butonuna basın
4. Sonuçları bekleyin ve analiz raporunu inceleyin

## 📸 Ekran Görüntüleri

### Eklenti Çalışırken
<img width="1670" height="952" alt="image" src="https://github.com/user-attachments/assets/3380bae5-b392-4bd8-9e83-6b310ab846d5" />

### Analiz Sonuçları
<img width="1670" height="947" alt="Ekran görüntüsü 2025-08-04 180755" src="https://github.com/user-attachments/assets/a4bc6220-e4aa-4417-9306-97fbebbcb93f" />


## 🔧 Geliştirme

### Proje Yapısı
```
SahibindenCarAnalyzer/
├── extension/ # Chrome uzantısı dosyaları
│ ├── content.js # Sayfa içeriği script'i
│ ├── popup.html # Uzantı arayüzü
│ ├── popup.js # Arayüz işlevleri
│ └── manifest.json # Uzantı konfigürasyonu
├── python-api/ # Backend API
│ ├── app.py # Flask uygulaması
│ └── requirements.txt
└── README.md
```
<div align="center">
  ⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın.
</div>
