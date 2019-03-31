//Processbar
var bar = new ProgressBar.Circle(template, {
  color: '#FF7043',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#FF7043', width: 4 },
  to: { color: '#FF7043', width: 4 },
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
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '50px';



////////////////
var bar1 = new ProgressBar.Circle(humidity, {
  color: '#0277BD',
  // This has to be the same size as the maximum width to
  // prevent clipping
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
bar1.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar1.text.style.fontSize = '50px';


//Socket
var socket = io("http://localhost:3000");
socket.on("Server-send-data",function(data){
  // $("#noidung").append(data);
  console.log(typeof data.humidity);
  // document.getElementById("template").innerHTML = "Temperature: "+ data.temperature;
  // document.getElementById("humidity").innerHTML = "Humidity: "+ data.humidity;
  // socket.emit("client-send-data",{ my: 'data' });
  bar.animate((data.temperature)/100);  // Number from 0.0 to 1.0
  bar1.animate((data.humidity)/100);  // Number from 0.0 to 1.0  

  //Light
  
  if(data.light == 1){
    document.getElementById("light").innerHTML = "Led tat";
  }
  else if(data.light == 0){
    document.getElementById("light").innerHTML = "Led sang";    
  }

  //Soil Moisture
  document.getElementById("soil").innerHTML = data.SoilMoisture;
});

//DateTimePicker 
$( document ).ready(function() {
  $('#datetimepicker1').datetimepicker();
});