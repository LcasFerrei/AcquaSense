// Código original professor

#include <WiFi.h>
#include <PubSubClient.h>
#include <LiquidCrystal_I2C.h>

const int ledpin = 2;
const char *topic = "unifor/teste";


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
  client.publish (topic, "Oia eu aqui");
  delay(1000);


}


