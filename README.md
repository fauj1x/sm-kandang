This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


# Sistem Monitoring Kualitas Udara dan Lingkungan Berbasis IoT

## 1. Introduction / Pendahuluan

**English:**  
This project is an IoT-based monitoring and control system designed for poultry houses and indoor air quality management. 
The system integrates multiple sensors connected to an ESP32 microcontroller to measure environmental parameters such as 
temperature, humidity, carbon dioxide, ammonia, and flammable gases. The sensor data is processed and stored in Firebase, 
while a mobile-friendly web dashboard is developed using Next.js to visualize the monitoring results in real-time.

**Indonesian:**  
Proyek ini adalah sistem monitoring dan kontrol berbasis IoT yang dirancang untuk kandang ayam petelur dan manajemen kualitas udara dalam ruangan. 
Sistem ini mengintegrasikan beberapa sensor yang terhubung ke mikrokontroler ESP32 untuk mengukur parameter lingkungan seperti 
suhu, kelembapan, karbon dioksida, amonia, dan gas mudah terbakar. Data sensor diproses dan disimpan di Firebase, 
sementara dashboard web ramah seluler dikembangkan menggunakan Next.js untuk menampilkan hasil monitoring secara real-time.

## 2. Tujuan
- Memantau parameter lingkungan penting di dalam kandang ayam atau lingkungan dalam ruangan.
- Menjaga kesehatan dan produktivitas ternak dengan mengontrol ventilasi berdasarkan kadar gas dan suhu.
- Menyediakan antarmuka web yang ramah seluler agar pengguna dapat mengakses data monitoring dengan mudah.
- Mengimplementasikan database berbasis cloud (Firebase) untuk menyimpan dan mengambil data sensor secara real-time.

## 3. Komponen Perangkat Keras
- **ESP32**: Mikrokontroler dengan dukungan Wi-Fi untuk mengirim data ke Firebase.
- **DHT22 Sensor**: Mengukur suhu dan kelembapan.
- **MQ-135 Sensor**: Mendeteksi konsentrasi CO₂ dan kualitas udara umum (termasuk amonia).
- **MQ-2 Sensor**: Mendeteksi asap, LPG, dan gas mudah terbakar.
- **Modul Relay**: Mengontrol sistem kipas untuk ventilasi.

## 4. Komponen Perangkat Lunak
- **Next.js**: Framework berbasis React untuk membangun dashboard web mobile-first.
- **Firebase**: Database cloud untuk menyimpan data sensor (Realtime Database atau Firestore).
- **ESP-IDF / Arduino IDE**: Lingkungan pengembangan firmware untuk ESP32.

## 5. Fitur Sistem
- Monitoring real-time untuk:
  - Suhu (°C)
  - Kelembapan (%RH)
  - Karbon Dioksida (ppm)
  - Amonia / Kualitas Udara (ppm)
  - Asap / Gas Mudah Terbakar (ppm)
  - Status Kipas (ON/OFF)
- Visualisasi tren historis (grafik suhu dan gas).
- Dashboard ramah seluler yang dapat diakses melalui jaringan lokal atau cloud.
- Kontrol kipas otomatis menggunakan logika fuzzy (berdasarkan suhu dan konsentrasi gas).

## 6. Alur Data
1. ESP32 membaca data dari sensor DHT22, MQ-135, dan MQ-2.
2. Data dikirim ke Firebase (Realtime Database atau Firestore).
3. Frontend Next.js mengambil dan berlangganan pembaruan dari Firebase.
4. Dashboard menampilkan nilai sensor dan status kipas secara real-time.

## 7. Setup Firebase
- Buat proyek Firebase melalui [Firebase Console](https://console.firebase.google.com/).
- Aktifkan **Firestore Database** atau **Realtime Database**.
- Konfigurasi aturan keamanan untuk akses data real-time.
- Salin konfigurasi kredensial Firebase ke dalam file `.env.local` di proyek Next.js.

Contoh konfigurasi (`.env.local`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 8. Memulai (Next.js)
Clone repository:
```
git clone https://github.com/fauj1x/sm-kandang.git
cd sm-kandang
```

Instal dependensi:
```
npm install
# atau
yarn install
```

Jalankan development server:
```
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat dashboard monitoring.

## 9. Deployment
Dashboard Next.js dapat dengan mudah dideploy menggunakan **Vercel Platform**:  
[https://vercel.com/new](https://vercel.com/new)

## 10. Referensi
- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Dokumentasi Firebase](https://firebase.google.com/docs)
- [Dokumentasi Scikit-Fuzzy](https://pythonhosted.org/scikit-fuzzy/) (untuk simulasi logika fuzzy)
