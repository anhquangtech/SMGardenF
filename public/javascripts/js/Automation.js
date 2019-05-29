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
socket.on("Server-send-data",function (data){
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
  console.log(data);
});

//Automation ON/OFF Pump
//Khay A
function jsFunction(value)
{
    var RauCai = {
      "RauCai": 1,
    }
    var RauMam = {
      "RauMam": 2,
    } 
    
    if(value=="Rau cải"){
      //Harvest time: Rau Cai
      //Website => Server => NodeMcu: Select Rau Cai
      socket.emit("RauCai-send-server-data", RauCai);
    } 
    else if(value == "Rau mầm"){
      //Website => Server => NodeMcu: Select Rau Mam
      socket.emit("RauMam-send-server-data", RauMam);
    }
}

//Khay B
function jsFunctionB(value)
{
    var RauCaiB = {
      "RauCaiB": 1,
    }
    var RauMamB = {
      "RauMamB": 2,
    } 
    if(value=="Rau cải"){
      socket.emit("RauCaiB-send-server-data", RauCaiB);
    } 
    else if(value == "Rau mầm"){
      socket.emit("RauMamB-send-server-data", RauMamB);
    }
}
//Harvest time
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  // var hoursSpan = clock.querySelector('.hours');
  // var minutesSpan = clock.querySelector('.minutes');
  // var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days + " d " + t.hours + " h";
    // hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    // minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    // secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 10000);
}

var deadline = new Date(Date.parse(new Date()) + 4 * 24 * 60 * 60 * 1000);
initializeClock('clockdiv', deadline);
//Rau mam
//DateTimePicker 
// $( document ).ready(function() {
//   $('#datetimepicker1').datetimepicker();
// });

// Harvest time





