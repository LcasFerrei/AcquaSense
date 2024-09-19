
#include <WiFi.h>
#include <PubSubClient.h>

// Definições do pino do sensor
const int sensorPin = 13;  // GPIO 13 para o sensor de fluxo
const char *topic = "teste/acquasense";

const int ledpin = 2;

volatile int pulseCount = 0;
float flowRate = 0.0;
unsigned long totalMilliLitres = 0;

void pulseCounter() {
  pulseCount++;
}


void initWiFi(){
  WiFi.mode(WIFI_STA);
  WiFi.begin("Jardis", "85071626");
  Serial.print("Conectando ao wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
    
  }
  Serial.println(WiFi.localIP());

}

WiFiClient espClient;
PubSubClient client(espClient);  

void setup() {
Serial.begin(115200);
initWiFi();
const char *mqtt_broker = "broker.hivemq.com";
const int mqtt_port = 8884;

client.setServer(mqtt_broker, mqtt_port);

pinMode(sensorPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(sensorPin), pulseCounter, FALLING);

while(!client.connected()){
  String cID = "esp32";
  Serial.printf("Cliente conectado...");
  if(client.connect(cID.c_str(), "", "")){
    Serial.println("Deu bom");
  } else {
    Serial.println("Deu ruim");
    delay(2000);
  }

}


}

void loop() {
  unsigned long currentTime = millis();
  flowRate = pulseCount / ((currentTime - totalMilliLitres) / 1000.0); // Fluxo em pulsos por segundo
  unsigned int flowMilliLitres = (flowRate / 1900) * 1000; // Conversão para mililitros (ajuste conforme o sensor)
  totalMilliLitres += flowMilliLitres;

  // Publica os dados no tópico
  String message = "Fluxo: " + String(flowRate) + " L/min, Total: " + String(totalMilliLitres) + " mL";
  client.publish(topic, message.c_str());

  pulseCount = 0; // Reseta o contador de pulsos
  delay(1000); // Espera 1 segundo antes de repetir


}


