---
title: "Using the ESP32-CAM as a DIY Surveillance Tool"
description: "Learn how to transform the ESP32-CAM module into a cost-effective, Wi-Fi-enabled surveillance camera."
pubDate: 2024-06-02
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Introduction

The ESP32-CAM is a compact, low-cost development board that combines a powerful ESP32 SoC with a camera module (typically OV2640). Thanks to its integrated Wi-Fi and Bluetooth capabilities, it’s an ideal candidate for DIY surveillance applications. In this post, we’ll walk through the hardware requirements, software setup, and basic code examples needed to turn an ESP32-CAM into a standalone surveillance camera.

# Why ESP32-CAM for Surveillance?

- **Price**: Under \$10 USD for the module itself.
- **Connectivity**: Built-in 802.11b/g/n Wi-Fi and Bluetooth.
- **Camera Quality**: Up to 2 MP with JPEG compression.
- **GPIOs**: Additional pins for motion sensors, relays, or LEDs.
- **Form Factor**: Small footprint for hidden or compact installations.

# Hardware Requirements

1. ESP32-CAM board (e.g., AI-Thinker module)  
2. FTDI Serial TTL converter (for programming)  
3. Jumper wires  
4. 5 V power source (USB or LiPo battery with a regulator)  
5. Optional: PIR motion sensor, SD card module, case/enclosure  

# Wiring Diagram

Connect the FTDI adapter to the ESP32-CAM pins:

- FTDI 5 V → 5 V  
- FTDI GND → GND  
- FTDI TX → U0R (ESP32 RX)  
- FTDI RX → U0T (ESP32 TX)  
- IO0 → GND (to enter flash mode)  

If you add a PIR motion sensor:

- PIR VCC → 5 V  
- PIR GND → GND  
- PIR OUT → GPIO 13 (or any free GPIO)  

# Software Setup

1. **Arduino IDE**  
   - Install version ≥ 1.8.13.  
2. **Board Manager**  
   - URL: https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json  
   - Install “esp32” platform.  
3. **Select Board**  
   - Tools → Board → ESP32 Arduino → “AI Thinker ESP32-CAM”.  
4. **Libraries**  
   - None extra; the camera driver is bundled with the ESP32 core.

# Sample Code: Camera Web Server

```cpp
#include "esp_camera.h"
#include <WiFi.h>

// Replace with your network credentials
const char* ssid     = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Configure camera pins for AI-Thinker module
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

void startCameraServer();

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer   = LEDC_TIMER_0;
  config.pin_d0       = Y2_GPIO_NUM;
  config.pin_d1       = Y3_GPIO_NUM;
  config.pin_d2       = Y4_GPIO_NUM;
  config.pin_d3       = Y5_GPIO_NUM;
  config.pin_d4       = Y6_GPIO_NUM;
  config.pin_d5       = Y7_GPIO_NUM;
  config.pin_d6       = Y8_GPIO_NUM;
  config.pin_d7       = Y9_GPIO_NUM;
  config.pin_xclk     = XCLK_GPIO_NUM;
  config.pin_pclk     = PCLK_GPIO_NUM;
  config.pin_vsync    = VSYNC_GPIO_NUM;
  config.pin_href     = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn     = PWDN_GPIO_NUM;
  config.pin_reset    = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size   = FRAMESIZE_VGA;
  config.jpeg_quality = 10;
  config.fb_count     = 2;

  // Initialize camera
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed: 0x%x", err);
    return;
  }

  startCameraServer();
  Serial.println("Camera server started");
}

void loop() {
  // Main loop does nothing; web server callbacks handle requests
}

#include <WebServer.h>
WebServer server(80);

void handleJPGStream() {
  WiFiClient client = server.client();
  String header = "HTTP/1.0 200 OK\r\n"
                  "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n";
  client.write(header.c_str());

  while (true) {
    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) break;
    client.printf("--frame\r\nContent-Type: image/jpeg\r\n\r\n");
    client.write(fb->buf, fb->len);
    client.write("\r\n");
    esp_camera_fb_return(fb);
    if (!client.connected()) break;
  }
}

void startCameraServer() {
  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html",
      "<html><body><img src=\"/stream\"/></body></html>");
  });
  server.on("/stream", HTTP_GET, handleJPGStream);
  server.begin();
}
```

# Optional Upgrades

- **Motion Detection**: Use a PIR sensor to trigger video capture or notifications.  
- **Local Storage**: Integrate an SD card slot to save snapshots.  
- **Cloud Alerts**: Post images to a web service or send push notifications.  
- **Encryption**: Host the stream on HTTPS by proxying through a secure server (e.g., NGINX).

# Security Considerations

- Change the default Wi-Fi credentials frequently.  
- Deploy on a private network or VPN.  
- Use firewall rules to restrict access.  
- Offload HTTPS to a proxy if end-to-end encryption is required.

# Power and Enclosure

- Use a stable 5 V supply capable of 500 mA+.  
- Consider a LiPo battery with a charging module for portable setups.  
- Enclose the board and camera in a weather-proof case for outdoor use.

# Conclusion

With minimal hardware and straightforward code, the ESP32-CAM becomes a powerful surveillance tool. Whether for home monitoring, wildlife observation, or robotics vision, you can customize firmware features, integrate sensors, and secure your stream—all within a few hours of setup. Give it a try and explore advanced applications like facial recognition or AI-based alerts on the edge.