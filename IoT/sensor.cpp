#include <LiquidCrystal_I2C.h>

const int sensorPin = 2;
const int buttonPin = 4;
const int buzzerPin = 7;

const int rgbRed = 12;
const int rgbBlue = 10;
const int rgbGreen = 11;

volatile int pulseCount = 0;
float flowRate = 0.0;
float l_minute = 0.0;
unsigned int flowMilliLitres = 0;
unsigned long totalMilliLitres = 0;
unsigned long oldTime = 0;
int buttonLastState = HIGH;
int rgbAtual = 0;

unsigned long currentTime;
unsigned long cloopTime;

LiquidCrystal_I2C lcd(0x27, 20, 4);

void pulseCounter(){
  pulseCount++;
}

void exibeCabecalho(){
  lcd.setCursor(0, 0);
  lcd.print("ACQUASENSE");
  lcd.setCursor(0, 1);
  lcd.print("Consumo de Agua:");
}

void apagaRGB(){
  digitalWrite(rgbRed, LOW);
  digitalWrite(rgbBlue, LOW);
  digitalWrite(rgbGreen, LOW);  
}

void acendeRGB(int totalMilliLitres){
  if(totalMilliLitres < 1000 && rgbAtual != 1){
    apagaRGB();
    rgbAtual = 1;
    digitalWrite(rgbGreen, HIGH);
  }
  if(totalMilliLitres > 1000 && totalMilliLitres < 2000 && rgbAtual != 2){
    apagaRGB();
    rgbAtual = 2;
    digitalWrite(rgbBlue, HIGH);
  }
  if(totalMilliLitres > 2000 && rgbAtual != 3){
    apagaRGB();
    rgbAtual = 3;
    digitalWrite(rgbRed, HIGH);
  }
}

void setup(){
  Serial.begin(115200);

  pinMode(sensorPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(sensorPin), pulseCounter, FALLING);

  pinMode(buttonPin, INPUT);
  pinMode(buzzerPin, OUTPUT); // Configura o pino do buzzer como saída

  pinMode(rgbRed, OUTPUT);
  pinMode(rgbBlue, OUTPUT);
  pinMode(rgbGreen, OUTPUT);

  lcd.init();
  lcd.backlight();
  exibeCabecalho();
}

void loop(){
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - oldTime;
  flowRate = pulseCount / (elapsedTime / 1000.0); // Fluxo em pulsos por segundo
  flowMilliLitres = (flowRate / 1900) * 1000; // Conversão para mililitros (o valor 5.5 pode variar de acordo com as especificações do sensor de vazão)
  totalMilliLitres += flowMilliLitres;
  oldTime = currentTime;
  pulseCount = 0;

  Serial.print("Fluxo: ");
  Serial.print(flowRate);
  Serial.print(" L/min\t");
  Serial.print("Total: ");
  Serial.print(totalMilliLitres);
  Serial.println(" mL");

  lcd.setCursor(0, 2);
  lcd.print("Total: ");
  lcd.print(totalMilliLitres);
  lcd.print(" mL");

  acendeRGB(totalMilliLitres);
  
  if(digitalRead(buttonPin) == HIGH){
    totalMilliLitres = 0;

    lcd.clear();
    exibeCabecalho();

    tone(buzzerPin, 1500);
    delay(200);
    noTone(buzzerPin);

    while (digitalRead(buttonPin) == HIGH){
      delay(10);
    }
  }

  delay(100);
}
