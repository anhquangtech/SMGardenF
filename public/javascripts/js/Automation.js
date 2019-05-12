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
  document.getElementById("soil1").innerHTML = data.SoilMoisture1;
  document.getElementById("soil2").innerHTML = data.SoilMoisture2;
});

//DateTimePicker 
// $( document ).ready(function() {
//   $('#datetimepicker1').datetimepicker();
// });

// // Event script
// // Socket.io: Website => Socket server => NodeMcu
// var pump = document.querySelector('.pump');
// var pump2 = document.querySelector('.pump2');

// var pumpJson = {
//     "pumpOn": 1,
// }
// var pumpJson2 = {
//     "pumpOff": 2,
// }

// $(function() {
//   $('#toggle-event').change(function() {
//     $('#console-event').html('Toggle: ' + $(this).prop('checked'));
//     if( $(this).prop('checked') == true){
//       socket.emit("PumpOn-send-sever-data", pumpJson);
//     } else{
//       socket.emit("PumpOff-send-sever-data", pumpJson2);
//     };
//   })
// })

//Automation ON/OFF Pump
//Khay A
//Rau cai
function jsFunction(value)
{
    if(value=="Rau cải"){
      // if(data.humidity > 80){
      //   console.log("Do am cao vai lozz");
      // }
      console.log('Rau cai');
    } 
    else if(value == "Rau mầm"){
      console.log("Rau mam");
    }
}
//Rau mam

