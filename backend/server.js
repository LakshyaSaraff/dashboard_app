// const express = require('express');
const mqtt = require('mqtt')
const protocol = 'mqtt'
const host = '192.168.1.5'
const port = '1883'
const clientId = 'mqtt_${Math.random().toString(16).slice(3)}'
const connectUrl = `${protocol}://${host}:${port}`


// const http = require('http');
// const cors = require('cors');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(cors());

// const mqttClient = mqtt.connect('mqtt://localhost');  // Change if using remote broker

// let latestData = {};

// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe('sensors/#');
// });

// mqttClient.on('message', (topic, message) => {
//   const data = message.toString();
//   latestData[topic] = data;
//   io.emit('mqttData', { topic, data });
// });

// app.get('/api/data', (req, res) => {
//   res.json(latestData);
// });

// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
