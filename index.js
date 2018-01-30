var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var cl = []

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() {  })
  // }, 1000)
  //cl.push(ws)

  console.log("websocket connection open")

  ws.on("message", function(message) {
    console.log("input");
    console.log(message);
    var obj = JSON.parse(message);
    console.log(typeof(obj));

    if ("msg" in obj) {
      var t_msg = "";
      for (var i = 0; i < obj.msg.length; i++) {
        t_msg = t_msg + " " + obj.msg[i];
      }
      console.log("clients");
      console.log(cl.length);
      for (var i = 0; i < cl.length; i++) {
        if (ws == cl[i].ws_tel && cl[i].ws_pc != "") {
          console.log("message");
          console.log(t_msg);
          cl[i].ws_pc.send(t_msg);
        }
      }
    } else {
      if ("log" in obj && "pass" in obj && "pos" in obj) {
        var t_data = null;
        for (var i = 0; i < cl.length; i++) {
          if (cl[i].log == obj.log && cl[i].pass == obj.pass) {
            t_data = cl[i];
          }
        }
        if (t_data == null) {
          cl.push({"ws_pc": "", "ws_tel": "", "log": obj.log, "pass": obj.pass});
          t_data = cl[cl.length-1];
        }
        console.log("data");
        console.log(typeof(t_data.ws_pc));
        console.log(typeof(t_data.ws_tel));
        if (obj.pos == "0" && t_data.ws_tel == "") {
          console.log("t_data.ws_tel");
          t_data.ws_tel = ws;
        } else if (t_data.ws_pc == "") {
          console.log("t_data.ws_pc");
          t_data.ws_pc = ws;
        }
      }
    }

   //  for (var i = 0; i < cl.length; i++) {
  	// 	cl[i].send(message)
  	// }

  	//ws.send(message)
  })

  ws.on("close", function() {
    console.log("websocket connection close")
    for (var i = 0; i < cl.length; i++) {
        if (ws == cl[i].ws_tel) {
            cl[i].ws_tel = "";
        } else if (ws == cl[i].ws_pc) {
            cl[i].ws_pc = "";
        }
        if (cl[i].ws_pc == "" && cl[i].ws_tel == "") {
            console.log(cl.length);
            cl.splice(i, 1);
            console.log(cl.length);
        }
    }
    //clearInterval(id)
  })
})
