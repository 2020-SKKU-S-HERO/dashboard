"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlRouter = void 0;
const express = require("express");
const mqtt = require("mqtt");
const router = express.Router();
exports.controlRouter = router;
const host = '34.64.238.233';
const mqttUri = `mqtt://${host}`;
const topic = 'ctrl';
router.get('/', (req, res) => {
    res.render('control.html');
});
router.post('/', (req, res) => {
    const client = mqtt.connect(mqttUri);
    client.on('connect', (connection) => {
        const data = req.body.data;
        client.publish(topic, data.toString(), { qos: 0 }, (err, packet) => {
            if (!err) {
                console.log(`Data sent to ${topic} -- ${data}`);
            }
            client.end();
        });
    });
});
//# sourceMappingURL=control.js.map