var host = location.origin.replace(/^http/, 'ws');
//var ws = new WebSocket(host);
var ws = null;
var logged = false;

var con = document.getElementById("btn_connect");
var log = document.getElementById("log");
var pass = document.getElementById("pass");
var key = document.getElementById("keyboard");
var pings = document.getElementById("pings");
var controls = document.getElementsByClassName("control")
var slide1 = document.getElementById("slide1");
var slide2 = document.getElementById("slide2");
var slide3 = document.getElementById("slide3");
var slide4 = document.getElementById("slide4");

var menu = document.getElementById("menu");
var note = document.getElementById("note");
var mouse = document.getElementById("mouse");
var x_koord = 0;
var y_koord = 0;
var x_slide_koord = 0;
var pen = document.getElementById("pen");
var coffee = document.getElementById("coffee");

var mouses = document.querySelectorAll("a[href='#mouse']");
var keyboards = document.querySelectorAll("a[href='#keyboard']");

// window.onload = function() {
//   menu.style.display = "block";
//   note.style.display = "none";
//   key.style.display = "none";
//   mouse.style.display = "none";
//   pen.style.display = "none";
//   coffee.style.display = "none";
// }

con.onclick = function (event) {
  connect();
  slide2.checked = true;
}

// con.onclick = function (event) {
//   menu.style.display = "none";
//   note.style.display = "none";
//   key.style.display = "block";
//   mouse.style.display = "none";
//   pen.style.display = "none";
//   coffee.style.display = "none";
//   //connect();
// }

// mouses[0].addEventListener("click", mouse_click, false);
// function mouse_click(evt) {
//   // -moz-transform: rotate(15deg); /* Äëÿ Firefox */
//   // -ms-transform: rotate(15deg); /* Äëÿ IE */
//   // -webkit-transform: rotate(15deg); /* Äëÿ Safari, Chrome, iOS */
//   // -o-transform: rotate(15deg); /* Äëÿ Opera */
//   // transform: rotate(15deg);

//   key.style.transition = "3s linear";
//   key.style.MozTransform = "translate(-10000px,0)";
//   key.style.WebkitTransform = "translate(-10000px,0)";
//   key.style.OTransform = "translate(-10000px,0)";
//   key.style.MsTransform = "translate(-10000px,0)";
//   key.style.transform = "translate(-10000px,0)";

//   // menu.style.display = "none";
//   // note.style.display = "none";
//   // key.style.display = "none";
//   // mouse.style.display = "block";
//   // pen.style.display = "none";
//   // coffee.style.display = "none";
// }

// keyboards[0].addEventListener("click", keyboard_click, false);
// function keyboard_click(evt) {
//   menu.style.display = "none";
//   note.style.display = "none";
//   key.style.display = "block";
//   mouse.style.display = "none";
//   pen.style.display = "none";
//   coffee.style.display = "none";
// }

function send_log() {
  console.log("send log");
  if (ws) {
    console.log(ws.readyState);
    if (ws.readyState == 1 && log.value != "" && pass.value != "") {
      console.log('{"pos":"0","log":"' + log.value.toLowerCase() + '","pass":"' + pass.value.toLowerCase() + '"}');
      console.log(JSON.stringify({"pos": 0, "log": log.value.toLowerCase(), "pass": pass.value.toLowerCase()}));
      ws.send('{"pos":"0","log":"' + log.value.toLowerCase() + '","pass":"' + pass.value.toLowerCase() + '"}');
      logged = true;
    } else {
      logged = false;
    }
  }
}

function connect() {
  console.log("connect");
  if (ws) {
    ws.close();
  }
  ws = new WebSocket(host + ':9502');
  ws.onopen = function() {
    //alert("Connection open");
    send_log();
  };
  ws.onclose = function() {
    logged = false;
  }
}

var msg = [];
function send_msg(msg) {
  console.log("msg");
  if (ws) {
    console.log(ws.readyState);
    if (ws.readyState == 1 && logged == true) {
      console.log("msg in");
      console.log(msg);
      var li = document.createElement('li');
      li.innerHTML = msg;
      // document.querySelector('#pings').appendChild(li);
      console.log(pings.firstChild.innerHTML);
      console.log(pings.firstChild.nextSibling.innerHTML);
      pings.insertBefore(li, pings.firstChild.nextSibling);
      ws.send(JSON.stringify({"msg": msg}));
    } else {
      // alert("Connection close");
      slide1.checked = true;
    }
  } else { alert("Connection error"); }
}

key.onclick = function(event) {
  msg.push(event.target.id);
  if (event.target.id != "CTRL" && event.target.id != "ALT" && event.target.id != "SHIFT") {
    if (log.value != "" && pass.value != "" && (logged == false || (ws && ws.readyState != 1))) {
      console.log("to connect");
      connect();
      setTimeout(function() {
        send_msg(msg);
      }, 1000);
    } else {
      console.log("else to connect");
      send_msg(msg);
    }
    msg = [];
  }
}
// console.log(host);

connect();

// ws.onmessage = function (event) {
//   var li = document.createElement('li');
//   li.innerHTML = JSON.parse(event.data);
//   document.querySelector('#pings').appendChild(li);
// };

controls[0].addEventListener("touchstart", slideHandleStart, false);
function slideHandleStart(evt) {
  evt.preventDefault();
  x_slide_koord = evt.changedTouches[0].pageX;
}

controls[0].addEventListener("touchend", slideHandleFinish, false);
function slideHandleFinish(evt) {
  if (evt.changedTouches[0].pageX - x_slide_koord > 50) {
    evt.preventDefault();
    previous_slide();
  } else if (evt.changedTouches[0].pageX - x_slide_koord < -50) {
    evt.preventDefault();
    next_slide();
  }
  x_slide_koord = 0;
}

function next_slide() {
  if (slide1.checked) { slide2.checked = true; }
  else if (slide2.checked) { slide3.checked = true; }
  else if (slide3.checked) { slide4.checked = true; }
  else { slide1.checked = true; }
}

function previous_slide() {
  if (slide2.checked) { slide1.checked = true; }
  else if (slide3.checked) { slide2.checked = true; }
  else if (slide4.checked) { slide3.checked = true; }
  else { slide4.checked = true; }
}

mouse.addEventListener("touchstart", handleStart, false);
function handleStart(evt) {
  evt.preventDefault();
  x_koord = evt.changedTouches[0].pageX;
  y_koord = evt.changedTouches[0].pageY;
  touch_time = Date.now();
}

mouse.addEventListener("touchend", handleFinish, false);
function handleFinish(evt) {
  evt.preventDefault();
  if (x_koord > 0) {
    if (Date.now() - touch_time > 2000 && Math.abs(evt.changedTouches[0].clientX - x_koord) < 10 && Math.abs(evt.changedTouches[0].clientY - y_koord) < 10) {
      send_msg([0, 0, 1]);
    } else {
      send_msg([parseInt(evt.changedTouches[0].clientX - x_koord), parseInt(evt.changedTouches[0].clientY - y_koord)]);
    }
    x_koord = 0;
    y_koord = 0;
    touch_time = 0;
  }
}

mouse.onmousedown = function(e) {
  x_koord = e.clientX;
  y_koord = e.clientY;
  touch_time = Date.now();
}

mouse.onmouseup = function(e) {
  if (x_koord > 0) {
    if (Date.now() - touch_time > 2000 && Math.abs(e.clientX - x_koord) < 5 && Math.abs(e.clientY - y_koord) < 5) {
      send_msg([0, 0, 1]);
    } else {
      send_msg([parseInt(e.clientX - x_koord), parseInt(e.clientY - y_koord)]);
    }
    x_koord = 0;
    y_koord = 0;
    touch_time = 0;
  }
}
