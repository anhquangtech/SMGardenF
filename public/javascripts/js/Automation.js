//Processbar
//Template
var bar = new ProgressBar.Circle(template, {
  color: '#FF7043',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#FF7043', width: 4 },
  to: { color: '#FF7043', width: 4 },
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value);
    }
  }
});
bar.text.style.fontFamily = '"Lato", sans-serif';
bar.text.style.fontSize = '50px';



//Humidity
var bar1 = new ProgressBar.Circle(humidity, {
  color: '#0277BD',
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#0277BD', width: 4 },
  to: { color: '#0277BD', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value);
    }
  }
});
bar1.text.style.fontFamily = '"Lato", sans-serif';
bar1.text.style.fontSize = '50px';


//Socket.io NodeMcu => Server => Website
var socket = io("http://localhost:3000");
socket.on("Server-send-data",function(data){
  // socket.emit("client-send-data",{ my: 'data' });
  bar.animate((data.temperature)/100);  // Number from 0.0 to 1.0
  bar1.animate((data.humidity)/100);  // Number from 0.0 to 1.0  

  //Light
  if(data.light == 1){
    document.getElementById("light").innerHTML = "Sunny";
  }
  else if(data.light == 0){
    document.getElementById("light").innerHTML = "Rain";    
  }

  //Soil Moisture
  document.getElementById("soil").innerHTML = data.SoilMoisture;
});

//DateTimePicker 
// $( document ).ready(function() {
//   $('#datetimepicker1').datetimepicker();
// });

// Event script
// Socket.io: Website => Socket server => NodeMcu
var pump = document.querySelector('.pump');
var pump2 = document.querySelector('.pump2');
var pumpJson = {
    "pumpOn": 1,
}
var pumpJson2 = {
    "pumpOff": 2,
}
pump.onclick = function(){
  socket.emit("PumpOn-send-sever-data", pumpJson);
  pump.classList.toggle("pumpOnOff");
}
pump2.onclick = function(){
  socket.emit("PumpOff-send-sever-data", pumpJson2);
}



