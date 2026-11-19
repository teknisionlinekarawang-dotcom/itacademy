# Dokumentasi Lengkap: Server Manager All-in-One

Dokumen ini berisi panduan instalasi server (Deployment) dan dokumentasi API untuk integrasi aplikasi Client.

---

## BAGIAN 1: Tutorial Instalasi di VPS (Linux)

Panduan ini untuk Administrator yang ingin men-deploy server ke VPS (Ubuntu/Debian/CentOS/AlmaLinux).

### 1. Persiapan Server
Login ke terminal VPS Anda via SSH.
Upload seluruh isi folder proyek `dashboard_server` ke sebuah direktori di VPS (misalnya ke `/root/my_app`). Pastikan semua file dan folder, termasuk `all-in-one.py`, `install.sh`, dan folder `dashboard_html` ikut ter-upload.

### 2. Jalankan Installer Otomatis
Masuk ke direktori tempat Anda meng-upload file-file tersebut, lalu jalankan script `install.sh` dengan `sudo`.
 
```bash
# Contoh:
# cd /root/my_app

chmod +x install.sh
sudo ./install.sh
   ```ini
   [Unit]
   Description=Dashboard Server
   After=network.target

   [Service]
   User=root
   WorkingDirectory=/opt/dashboard_server
   ExecStart=/opt/dashboard_server/venv/bin/python3 /opt/dashboard_server/main.py
   Restart=always
   Environment=PORT=8081

   [Install]
   WantedBy=multi-user.target
   ```
3. Jalankan: `systemctl enable --now dashboard.service`

---

## BAGIAN 2: Dokumentasi API (Untuk Developer)

### 1. Konfigurasi Dasar

- **Base URL**: `http://[IP_SERVER_ANDA]:8081` (Contoh: `http://192.168.1.50:8081`)
- **Authentication**: Semua request ke API **WAJIB** menyertakan Header HTTP `X-Auth-Token`.
- **Token Source**: Token (License Key) didapatkan dengan cara membuatnya di Dashboard Admin.

### 2. Daftar Endpoint API

### A. Upload File
Digunakan untuk mengirim file dari aplikasi client ke server.

- **URL**: `/api/upload`
- **Method**: `POST`
- **Headers**: 
  - `X-Auth-Token`: `[LICENSE_KEY_ANDA]`
- **Body (Multipart/Form-Data)**:
  - `file`: `[Binary File Object]`

**Respon Sukses (200 OK):**
```json
{
  "info": "file 'laporan.pdf' saved at './local_storage/ClientA/laporan.pdf'"
}
```

### B. List File (Melihat Daftar File)
Melihat file apa saja yang sudah tersimpan di folder khusus client tersebut.

- **URL**: `/api/files`
- **Method**: `GET`
- **Headers**: 
  - `X-Auth-Token`: `[LICENSE_KEY_ANDA]`

**Respon Sukses (200 OK):**
```json
{
  "client": "NamaClientAnda",
  "files": ["file1.jpg", "data.txt"]
}
```

### C. Download File
Mengambil kembali file dari server.

- **URL**: `/api/files/{nama_file}`
- **Method**: `GET`
- **Headers**: 
  - `X-Auth-Token`: `[LICENSE_KEY_ANDA]`

### D. Hapus File
Menghapus file dari server.

- **URL**: `/api/files/{nama_file}`
- **Method**: `DELETE`
- **Headers**: 
  - `X-Auth-Token`: `[LICENSE_KEY_ANDA]`

### E. Database JSON (Simpan Data Aplikasi)
Fitur untuk menyimpan data JSON tanpa perlu setup database SQL manual.

- **Simpan Data (POST)**
  - **URL**: `/api/db/{nama_collection}` (Misal: `/api/db/users`)
  - **Body**: Raw JSON (Contoh: `{"nama": "User1", "score": 100}`)
  - **Respon**: `{"status": "saved", "id": 1}`

- **Ambil Data (GET)**
  - **URL**: `/api/db/{nama_collection}`
  - **Respon**: Array object `{ "id": 1, "data": {...}, "created_at": "..." }`

- **Update Data (PUT)**
  - **URL**: `/api/db/{nama_collection}/{data_id}`
  - **Body**: Raw JSON (Data baru)
  - **Respon**: `{"status": "updated", "id": 1}`

- **Hapus Data (DELETE)**
  - **URL**: `/api/db/{nama_collection}/{data_id}`
  - **Respon**: `{"status": "deleted", "id": 1}`

### F. IoT Integration (Smart Devices)
Fitur untuk menghubungkan perangkat IoT (ESP32/Arduino) agar bisa dipantau status onlinenya.

- **Heartbeat (Lapor Status)**
  - **URL**: `/api/iot/heartbeat`
  - **Method**: `POST`
  - **Headers**: 
    - `X-Device-Key`: `[DEVICE_KEY_DARI_ADMIN]`
  - **Respon**: `{"status": "ok", "server_time": "..."}`

### G. Tunneling (Akses Localhost via Internet)
Memungkinkan aplikasi yang berjalan di localhost (di balik NAT/Firewall) bisa diakses dari internet melalui server ini.

**Cara Kerja:**
1. Client (Agent) membuka koneksi WebSocket ke Server.
2. Server menerima request HTTP publik, lalu meneruskannya ke Client via WebSocket.
3. Client memproses request di localhost dan mengirim balik responnya.

- **WebSocket Endpoint (Agent)**: `ws://[IP_SERVER]:8081/ws/tunnel/{client_id}`
- **Public Access URL**: `http://[IP_SERVER]:8081/tunnel/{client_id}/`

### H. Domain Routing (Virtual Host)
Menggunakan satu IP Public untuk banyak aplikasi/domain. Server akan membelokkan traffic berdasarkan nama domain yang diakses.

**Konfigurasi (Via Dashboard Admin):**
1. **Domain**: Masukkan nama domain (misal: `app.kantor.com`).
2. **Target Type**:
   - `TUNNEL`: Mengarah ke Client Tunnel (misal: ID `pc-kantor`).
   - `LOCAL_PORT`: Mengarah ke aplikasi lain di server VPS yang sama (misal: port `3000`).

**Contoh Flow:**
- User akses `http://app.kantor.com` -> Server AIO -> Tunnel `pc-kantor` -> Localhost PC Kantor.

### I. AI Recognition (Biometric)
Fitur untuk mendaftarkan data biometrik (Wajah & Suara) ke server.

- **Register Wajah**
  - **URL**: `/api/face/register`
  - **Method**: `POST` (Multipart/Form-Data)
  - **Params**: `name` (String), `file` (Image File)
  - **Note**: Jika library `face_recognition` tidak terinstall, server akan merespon dengan status "MOCK MODE" (Simulasi) agar tidak error.

- **Recognize Wajah (Identifikasi)**
  - **URL**: `/api/face/recognize`
  - **Method**: `POST` (Multipart/Form-Data)
  - **Params**: `file` (Image File)
  - **Respon**: `{"status": "success", "match": true, "name": "Budi", "confidence": 0.95}`

- **Register Suara**
  - **URL**: `/api/voice/register`
  - **Method**: `POST` (Multipart/Form-Data)
  - **Params**: `name` (String), `file` (Audio File)

---

## BAGIAN 3: Contoh Implementasi Code

### A. Python (Menggunakan `requests`)

```python
import requests

url = "http://localhost:8081/api/upload"
headers = {"X-Auth-Token": "sk_live_uuid_anda"}
files = {"file": open("data.txt", "rb")}

response = requests.post(url, headers=headers, files=files)

if response.status_code == 200:
    print("Upload Sukses!")
elif response.status_code == 403:
    print("Akses Ditolak: License Suspended")
else:
    print("Error:", response.text)
```

### B. Android (Kotlin + Retrofit)

**1. Interface API (`ApiService.kt`)**
```kotlin
import okhttp3.MultipartBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface ApiService {
    @Multipart
    @POST("api/upload")
    fun uploadFile(
        @Header("X-Auth-Token") token: String,
        @Part file: MultipartBody.Part
    ): Call<ResponseBody>

    @GET("api/files")
    fun listFiles(@Header("X-Auth-Token") token: String): Call<ResponseBody>
}
```

**2. Cara Pakai di Activity**
```kotlin
val token = "LICENSE_KEY_ANDA"
val requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file)
val body = MultipartBody.Part.createFormData("file", file.name, requestFile)

apiService.uploadFile(token, body).enqueue(object : Callback<ResponseBody> {
    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
        if (response.isSuccessful) Log.d("API", "Upload Berhasil")
        else Log.e("API", "Gagal: ${response.code()}")
    }
    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
        Log.e("API", "Error Koneksi")
    }
})
```

### C. Windows Desktop (C# .NET)

```csharp
using System.Net.Http;
using System.IO;

public async Task UploadFile(string filePath, string token)
{
    using (var client = new HttpClient())
    {
        client.DefaultRequestHeaders.Add("X-Auth-Token", token);
        using (var content = new MultipartFormDataContent())
        {
            var fileStream = File.OpenRead(filePath);
            content.Add(new StreamContent(fileStream), "file", Path.GetFileName(filePath));

            var response = await client.PostAsync("http://localhost:8081/api/upload", content);
            if (response.IsSuccessStatusCode) Console.WriteLine("Sukses!");
            else Console.WriteLine("Gagal: " + response.StatusCode);
        }

        // --- CONTOH DATABASE (JSON) ---
        var json = "{\"nama\":\"Budi\", \"level\":\"Gold\"}";
        var jsonContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
        
        var dbResp = await client.PostAsync("http://localhost:8081/api/db/users", jsonContent);
    }
}
```

### D. Python Agent (Tunneling)

Script sederhana untuk menghubungkan localhost ke internet via Tunnel.

```python
import asyncio
import aiohttp

# KONFIGURASI
SERVER_WS_URL = "ws://[IP_SERVER]:8081/ws/tunnel/my-client-id"
LOCAL_TARGET_URL = "http://localhost:80"

async def main():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(SERVER_WS_URL) as ws:
            print("Connected!")
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    # Logika forwarding request (Lihat Dashboard untuk script lengkap)
                    pass

if __name__ == "__main__":
    asyncio.run(main())
```
