
	var mqtt;
	var reconnectTimeout = 2000;
	var Timestamp;

	function MQTTconnect() {
		if (typeof path == "undefined") {
			path = '/mqtt';
		}
			
		mqtt = new Paho.MQTT.Client(
				host,
				port,
				path,
				"web_" + parseInt(Math.random() * 100, 10)
				);
			
		var options = {
			timeout: 3,
			useSSL: useTLS,
			cleanSession: cleansession,
			onSuccess: onConnect,
			onFailure: function (message) {
				$('#status').val("Connection failed: " + message.errorMessage + "Retrying");
				setTimeout(MQTTconnect, reconnectTimeout);
			}
		};

		mqtt.onConnectionLost = onConnectionLost;
		mqtt.onMessageArrived = onMessageArrived;

		if (username != null) {
			options.userName = username;
			options.password = password;
		}
		console.log("Host="+ host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password);
		mqtt.connect(options);
	}

	//Called when successfully connected to MQTT_Broker
	function onConnect() {	
		mqtt.subscribe(moisture_topic, {qos: 0});
		//$('#status').val('Connected to ' + host + ':' + port + path);
	}

	//Called if web client lost tconnection to the MQTT_Broker
	function onConnectionLost(responseObject) {
		setTimeout(MQTTconnect, reconnectTimeout);
		$('#status').val("connection lost: " + responseObject.errorMessage + ". Reconnecting");
	};

	//Called if any message arrives
	function onMessageArrived(message) {
		var topic = message.destinationName;
		var payload = message.payloadString;
		var moisture = parseInt(payload)+3;
		
		//console.log('topic: '+typeof 'topic');
		console.log('payload: '+typeof 'payload');
		console.log('moisture_int: '+typeof 'moisture');
		//console.log('moisture_topic: '+	typeof 'moisture_topic');
				
		if(topic === moisture_topic) {
			//$('#ws').prepend('<li>' + moisture + '</li>');
			if(document.getElementById("myRange")) {
				document.getElementById("myRange").value = moisture;
			}
		}
		console.log("LED JS");
		//Print additional information
		//$('#ws').prepend('<li>' + topic + ' = ' + payload + '</li>');
	};
			
	
	function SendRGB(red, green, blue) {
		mqtt.send("LED_Bett/commands/colorpicker", "rgb("+red+","+green+","+blue+")", 1, false);
	}
			
	function SendCommand(action) {
		topic="LED_Bett/commands/"+action;
		mqtt.send(topic, "1", 1, false);
	}
	
			
  	$(document).ready(function() {
		console.log("HELLO from mqttconnection");
  		MQTTconnect();
  	});


	
	
			
