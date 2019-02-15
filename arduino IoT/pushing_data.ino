#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include "DHT.h"
#define DHTTYPE DHT11   // DHT 11

 
 // Pressure Sensor
int fsrPin = 0;  
// DHT Sensor
const int DHTPin = D1;
// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE);


void setup() {


  Serial.begin(115200);                                  //Serial connection
  delay(10); 
   
   dht.begin();
  
  WiFi.begin("Michaels iPhone", "hello123");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }
}

void loop() {

 
 // DHT  + Pressure Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
   float h = dht.readHumidity();
   // Read temperature as Celsius (the default)
   float t = dht.readTemperature();
   // pressure
   int w = analogRead(fsrPin);

   String hstring = String(h);
   String tstring = String(t);
   String wstring = String(w);

   HTTPClient http;    //Declare object of class HTTPClient

   while(true){
    

    
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
   float h = dht.readHumidity();
   // Read temperature as Celsius (the default)
   float t = dht.readTemperature();  
  // Read Pressure
   int w = analogRead(fsrPin);
   
   hstring = hstring + "," + String(h);
   tstring = tstring + "," + String(t);
   wstring = wstring + "," + String(w);

   //temp to rest server
   String bodytemp;
   bodytemp = "{\"$class\":\"org.example.mynetwork.TempHumidData\",\"temperature\":[" + tstring + "],\"humidity\":[" + hstring + "],\"dataId\":\"2_tempHumid_data\",\"sensor\": \"resource:org.example.mynetwork.Sensor#2_tempHumid\"}";
   
   http.begin("http://172.20.10.10:3000/api/TempHumidData/2_tempHumid_data");      //Specify request destination
   http.addHeader("Content-Type", "application/json");  //Specify content-type header

   int httpCode = http.PUT(bodytemp);   //Send the request
   String payload = http.getString();                  //Get the response payload

   http.end();  //Close connection

  //pressure to rest server
   String bodyweight;
   bodyweight = "{\"$class\":\"org.example.mynetwork.WeightData\",\"weight\":[" + wstring + "],\"dataId\":\"2_weight_data\",\"sensor\": \"resource:org.example.mynetwork.Sensor#2_weight\"}";
   
   http.begin("http://172.20.10.10:3000/api/WeightData/2_weight_data");      //Specify request destination
   http.addHeader("Content-Type", "application/json");  //Specify content-type header

   int httpCode2 = http.PUT(bodyweight);   //Send the request
   String payload2 = http.getString();                  //Get the response payload
   

   Serial.println(httpCode2);   //Print HTTP return code
   Serial.println(payload2);    //Print request response payload

 
   http.end();  //Close connection

  delay(5000);  //Send a request every 30 seconds
   }
}
