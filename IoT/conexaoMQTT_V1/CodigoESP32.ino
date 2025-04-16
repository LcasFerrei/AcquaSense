#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>

// =========================
// Configurações de Rede e MQTT
// =========================
#define WIFI_SSID "Jardis"
#define WIFI_PASSWORD "85071626"
#define MQTT_BROKER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_TOPIC "teste/acquasense"

// =========================
// Constantes e Variáveis
// =========================
constexpr int SENSOR_PIN = 13;
constexpr float ML_PER_PULSE = 133.33;
const int MAX_WIFI_TIMEOUT = 10000;
const int MAX_MQTT_TRIES = 5;

volatile int pulseCount = 0;
unsigned long totalMilliLitres = 0;
unsigned long oldTime = 0;
unsigned long totalPublishedMilliLitres = 0;

WiFiClient espClient;
PubSubClient client(espClient);

// =========================
// Funções de Callback
// =========================
void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

// =========================
// Inicialização do WiFi
// =========================
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao WiFi");

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < MAX_WIFI_TIMEOUT) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFalha ao conectar ao WiFi");
  }
}

// =========================
// Inicialização do Tempo (NTP)
// =========================
void initTime() {
  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Aguardando sincronização de tempo");

  unsigned long start = millis();
  while (!time(nullptr) && millis() - start < MAX_WIFI_TIMEOUT) {
    Serial.print(".");
    delay(500);
  }

  if (time(nullptr)) {
    Serial.println("\nTempo sincronizado com NTP");
  } else {
    Serial.println("\nFalha na sincronização com NTP");
  }
}

// =========================
// Reconectar ao Broker MQTT
// =========================
bool reconnect() {
  int tries = 0;
  while (!client.connected() && tries < MAX_MQTT_TRIES) {
    String clientId = "esp32-" + String(random(0xffff), HEX);
    Serial.printf("Tentando conectar ao MQTT (%d/%d)...\n", tries + 1, MAX_MQTT_TRIES);

    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado ao broker MQTT");
      return true;
    }

    Serial.print("Erro: ");
    Serial.println(client.state());
    delay(2000);
    tries++;
  }

  return false;
}

// =========================
// Obter Hora Formatada
// =========================
String getTimeString() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);
  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}

// =========================
// Setup
// =========================
void setup() {
  Serial.begin(115200);
  initWiFi();
  initTime();
  client.setServer(MQTT_BROKER, MQTT_PORT);

  pinMode(SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(SENSOR_PIN), pulseCounter, FALLING);
  oldTime = millis();
}

// =========================
// Loop Principal
// =========================
void loop() {
  if (!client.connected()) {
    if (!reconnect()) return;
  }

  client.loop();

  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - oldTime;

  if (elapsedTime >= 1000) {
    float flowMilliLitres = (pulseCount * ML_PER_PULSE);
    totalMilliLitres += flowMilliLitres;

    Serial.printf("Pulsos: %d | Fluxo (ml): %.2f\n", pulseCount, flowMilliLitres);

    if (flowMilliLitres > 0) {
      totalPublishedMilliLitres += flowMilliLitres;

      // Criar mensagem em JSON
      char payload[128];
      snprintf(payload, sizeof(payload),
               "{\"fluxo_ml\": %.2f, \"timestamp\": \"%s\"}",
               flowMilliLitres, getTimeString().c_str());

      // Publicar no MQTT
      if (client.publish(MQTT_TOPIC, payload)) {
        Serial.print("Publicado MQTT: ");
        Serial.println(payload);
      } else {
        Serial.println("Erro ao publicar no MQTT");
      }
    } else {
      Serial.println("Sem consumo detectado.");
    }

    Serial.print("Total publicado (ml): ");
    Serial.println(totalPublishedMilliLitres);

    pulseCount = 0;
    oldTime = currentTime;
  }
}
