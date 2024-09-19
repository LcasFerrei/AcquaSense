#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>  // Biblioteca para trabalhar com data e hora

const int sensorPin = 13;  // GPIO 13 para o sensor de fluxo
const char* ssid = "Jardis";           
const char* password = "85071626";     
const char* mqtt_broker = "broker.hivemq.com";  
const int mqtt_port = 1883;            
const char *topic = "teste/SaulSantos1";  

volatile int pulseCount = 0;
float flowRate = 0.0;
unsigned long totalMilliLitres = 0;
unsigned long oldTime = 0; // Armazena o tempo da última medição

WiFiClient espClient;
PubSubClient client(espClient);

// Função para contar os pulsos do sensor
void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

// Função para inicializar o Wi-Fi
void initWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Conectado ao WiFi");
  Serial.println(WiFi.localIP());
}

// Função para configurar o NTP e obter a hora
void initTime() {
  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov");  // Configura o NTP com fuso UTC-3 (Brasília)
  Serial.print("Aguardando sincronização de tempo");
  while (!time(nullptr)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nSincronizado com o NTP");
}

// Função para reconectar ao broker MQTT, se necessário
void reconnect() {
  while (!client.connected()) {
    String cID = "esp32";
    Serial.printf("Tentando conectar ao broker MQTT com ID %s...\n", cID.c_str());
    if (client.connect(cID.c_str())) {
      Serial.println("Conectado ao broker MQTT");
    } else {
      Serial.print("Falha ao conectar, código de erro: ");
      Serial.println(client.state());
      delay(5000);  // Espera 5 segundos antes de tentar reconectar
    }
  }
}

// Função para obter o horário atual formatado
String getTimeString() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);
  char buffer[80];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}

void setup() {
  Serial.begin(115200);
  initWiFi();
  initTime();  // Inicializa o NTP para sincronização de tempo
  client.setServer(mqtt_broker, mqtt_port);

  pinMode(sensorPin, INPUT_PULLUP);  // Configura o pino do sensor com resistor pull-up interno
  attachInterrupt(digitalPinToInterrupt(sensorPin), pulseCounter, FALLING); // Interrupção para o sensor

  oldTime = millis(); // Armazena o tempo inicial
}

void loop() {
  if (!client.connected()) {
    reconnect();  // Reconecta ao broker se a conexão for perdida
  }
  
  client.loop();  // Mantém a conexão ativa

  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - oldTime;

  if (elapsedTime >= 1000) {  // Atualiza a cada 1 segundo
    // Cálculo do fluxo de água em Litros por minuto
    flowRate = (pulseCount / 7.5); // Conversão de pulsos para L/min
    
    unsigned int flowMilliLitres = (flowRate / 60) * 1000; // Conversão para mililitros por segundo
    totalMilliLitres += flowMilliLitres;

    // Obtém a hora atual
    String timeString = getTimeString();

    // Cria a mensagem a ser enviada para o broker MQTT
    String message = "Horário: " + timeString + ", Fluxo: " + String(flowRate, 2) + " L/min, Total: " + String(totalMilliLitres) + " mL";
    
    // Publica a mensagem no tópico MQTT
    client.publish(topic, message.c_str());
    Serial.print("Mensagem publicada: ");
    Serial.println(message);
    delay(1000); 

    pulseCount = 0;  // Reseta o contador de pulsos para a próxima medição
    oldTime = currentTime;  // Atualiza o tempo para a próxima medição
  }
}
