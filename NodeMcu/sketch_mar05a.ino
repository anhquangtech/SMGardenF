
#include <ESP8266WiFi.h>
#include <SocketIOClient.h>

//test code
#include <ArduinoJson.h>
#include "DHTesp.h"
DHTesp dht;
#define LED D0 

#define DA_PIN A0   //AO - ADC 00 đọc DATA độ ẩm đất
#define DA_vcc1_PIN 16   //D0 - GPIO 16 Điều khiển nguồn để đọc Độ ẩm 1.
#define DA_vcc2_PIN 5    //D1 - GPIO 05 Điều khiển nguồn để đọc Độ ẩm 2.
//#define SD2 9
SocketIOClient client;
const char* ssid = "Daq";          //Tên mạng Wifi mà Socket server của bạn đang kết nối
const char* password = "123456789";  //Pass mạng wifi ahihi, anh em rãnh thì share pass cho mình với.
 
char host[] = "192.168.1.5";  //Địa chỉ IP dịch vụ, hãy thay đổi nó theo địa chỉ IP Socket server của bạn.
int port = 3000;                  //Cổng dịch vụ socket server do chúng ta tạo!
 
//từ khóa extern: dùng để #include các biến toàn cục ở một số thư viện khác. Trong thư viện SocketIOClient có hai biến toàn cục
// mà chúng ta cần quan tâm đó là
// RID: Tên hàm (tên sự kiện
// Rfull: Danh sách biến (được đóng gói lại là chuối JSON)
extern String RID;
extern String Rfull;
 
 
//Một số biến dùng cho việc tạo một task
unsigned long previousMillis = 0;
long interval = 5000;
 
void setup()
{
    //Bật baudrate ở mức 115200 để giao tiếp với máy tính qua Serial
    
    //test code
    dht.setup(4, DHTesp::DHT11); // Connect DHT sensor to GPIO 17
    pinMode(LED, OUTPUT);
    pinMode(D3, OUTPUT); //Connect YL-83

    // 29/4/2019
    pinMode(D7, OUTPUT); //Connect Relay 1
    pinMode(D8, OUTPUT); //Connetc Relay 2
//    pinMode(A0, INPUT);
//    pinMode(SD2, OUTPUT);
    
    // 11/5/2019
    pinMode (DA_vcc1_PIN,OUTPUT);
    pinMode (DA_vcc2_PIN,OUTPUT);
    
    Serial.begin(115200);
    delay(10);
 
    //Việc đầu tiên cần làm là kết nối vào mạng Wifi
    Serial.print("Ket noi vao mang ");
    Serial.println(ssid);
 
    //Kết nối vào mạng Wifi
    WiFi.begin(ssid, password);
 
    //Chờ đến khi đã được kết nối
    while (WiFi.status() != WL_CONNECTED) { //Thoát ra khỏi vòng 
        delay(500);
        Serial.print('.');
    }
 
    Serial.println();
    Serial.println(F("Da ket noi WiFi"));
    Serial.println(F("Di chi IP cua ESP8266 (Socket Client ESP8266): "));
    Serial.println(WiFi.localIP());
 
    if (!client.connect(host, port)) {
        Serial.println(F("Ket noi den socket server that bai!"));
        return;
    }
 
    //Khi đã kết nối thành công
    if (client.connected()) {
        //Thì gửi sự kiện ("connection") đến Socket server ahihi.
        client.send("connection", "message", "Connected !!!!");
    }

//    attachInterrupt(digitalPinToInterrupt(SD2),InterRauMam,RISING);
}

int trangthai = 1;
int trangthaiB = 2;
void loop()
{   
    //trangthai = 10 : Rau Cai
    //trangthai = 11 : Rau Mam
    
    int DATA_DA1;
    int DATA_DA2;
    digitalWrite (DA_vcc1_PIN,HIGH);
    delay(500);
    DATA_DA1 = analogRead (A0);
    digitalWrite (DA_vcc1_PIN,LOW);
    delay(1000);
    
    digitalWrite (DA_vcc2_PIN,HIGH);
    delay(500);
    DATA_DA2 = analogRead (A0);
    digitalWrite (DA_vcc2_PIN,LOW);
    delay(1000);
    
    String webPage;
    StaticJsonBuffer<500> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    
    root["humidity"] = dht.getHumidity(); //Put Sensor value
    root["temperature"] = dht.getTemperature();
    root["light"] = digitalRead(D3);//Reads Flash Button Status
//    root["SoilMoisture"] = analogRead(A0);
//    root["SoilMoisture1"] = analogRead(A0);
    root["SoilMoisture1"] = DATA_DA1;
    root["SoilMoisture2"] = DATA_DA2;
    delay(2000);
    root.printTo(webPage);
    root.printTo(Serial);
    Serial.println();
    
    //tạo một task cứ sau "interval" giây thì chạy lệnh:
    if (millis() - previousMillis > interval) {
        //lệnh:
        previousMillis = millis();
 
        //gửi sự kiện "atime" là một JSON chứa tham số message có nội dung là Time please?
        client.send("atime", "message", "Time please?");
        client.send("client-send-data",webPage);
//        client.send("client-send-data","message","hello");
    }
 
    //Khi bắt được bất kỳ sự kiện nào thì chúng ta có hai tham số:
    //  +RID: Tên sự kiện
    //  +RFull: Danh sách tham số được nén thành chuỗi JSON!
    if (client.monitor()) {
        Serial.println(RID);
        Serial.println(Rfull);
          //Server => NodeMcu: Pump water
          //Khay A
          if(RID == "PumpOn-send-nodemcu-data"){
                 Serial.println("Pump On");
                 digitalWrite(D7,HIGH);
//                 digitalWrite(SD2,HIGH);
//                 delay(2000);
//                 digitalWrite(SD2,LOW);
          }

          if(RID == "PumpOff-send-nodemcu-data"){
                 Serial.println("Pump Off");
                 digitalWrite(D7,LOW);
          }
          //Khay B
          if(RID == "PumpOnB-send-nodemcu-data"){
                 Serial.println("Pump On B");
                 digitalWrite(D8,HIGH);
          }

          if(RID == "PumpOffB-send-nodemcu-data"){
                 Serial.println("Pump Off B");
                 digitalWrite(D8,LOW);
          }
          
          //Server => NodeMcu: Vegetable
          //Khay A
          if(RID == "RauCai-send-nodemcu-data"){
                 Serial.println("RauCai");
                 trangthai = 10;
          }
         
          if(RID == "RauMam-send-nodemcu-data"){
                 Serial.println("RauMamB");
                 trangthai = 11;
          }
          //Khay B
          if(RID == "RauCaiB-send-nodemcu-data"){
                 Serial.println("RauCai");
                 trangthaiB = 12;
          }
         
          if(RID == "RauMamB-send-nodemcu-data"){
                 Serial.println("RauMamB");
                 trangthaiB = 13;
          }
     }
    //Automation Khay A
    Serial.println(trangthai);
    //Rau Cai
    if(trangthai == 10){
        if(dht.getHumidity() < 80 && DATA_DA1 < 836){
          Serial.println("Tuoi nuoc rau cai");
          digitalWrite(D7,HIGH);
          delay(5000);
          digitalWrite(D7,LOW);
        }
        else{
          Serial.println("Khong tuoi nuoc rau cai");
          digitalWrite(D7,LOW);
        }
    }
    //Rau Mam
    if(trangthai == 11){
        if(dht.getHumidity() < 100 && DATA_DA1 < 866){
          Serial.println("Tuoi nuoc rau mam");
          digitalWrite(D7,HIGH);
          delay(5000);
          digitalWrite(D7,LOW);
        }
        else{
          Serial.println("Khong tuoi nuoc rau mam");
          digitalWrite(D7,LOW);
        }
    }

    //Automation Khay B
    //Rau Cai
    if(trangthaiB == 12){
        if(dht.getHumidity() < 80 && DATA_DA2 < 836){
          Serial.println("Tuoi nuoc rau cai");
          digitalWrite(D8,HIGH);
          delay(5000);
          digitalWrite(D8,LOW);
        }
        else{
          Serial.println("Khong tuoi nuoc rau cai");
          digitalWrite(D8,LOW);
        }
    }
    //Rau Mam
    if(trangthaiB == 13){
        if(dht.getHumidity() < 100 && DATA_DA2 < 866){
          Serial.println("Tuoi nuoc rau mam");
          digitalWrite(D8,HIGH);
          delay(5000);
          digitalWrite(D8,LOW);
        }
        else{
          Serial.println("Khong tuoi nuoc rau mam");
          digitalWrite(D8,LOW);
        }
    }

    //Kết nối lại!
    if (!client.connected()) {
      client.reconnect(host, port);
    }
}
//void InterRauMam(){
//  Serial.println("Rau Mam1");
//  Serial.println(dht.getHumidity());
//  delay(2000);  
//}
