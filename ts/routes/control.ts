import * as express from 'express';
import * as mqtt from 'mqtt';

const router: express.Router = express.Router();
export { router as controlRouter };

const host = '127.0.0.1';
const mqttUri = `mqtt://${host}`;
const topic = 'control';

router.get('/', (req: any, res: any): void => {
    res.render('control.html');
});

router.post('/', (req: any, res: any): void => {
    const client: mqtt.MqttClient = mqtt.connect(mqttUri);
    
    client.on('connect', (connection: mqtt.Packet): void => {
        const data = req.body.data;
        
        client.publish(topic, data.toString(), { qos: 0 }, (err: Error | undefined, packet: mqtt.Packet | undefined): void => {
            if (!err) {
                console.log(`Data sent to ${topic} -- ${data}`);
            }
    
            client.end();
        });
    });
});