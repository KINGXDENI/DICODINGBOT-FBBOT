// const express = require('express');
// require('dotenv').config();

// const webApp = express();

// const PORT = process.env.PORT || 5000;

// webApp.use(express.urlencoded({ extended: true }));
// webApp.use(express.json());
// webApp.use((req, res, next) => {
//   console.log(`Path ${req.path} with Method ${req.method}`);
//   next();
// });

// const homeRoute = require('./routes/homeRoute');
// const fbWebhookRoute = require('./routes/fbWebhookRoute');

// webApp.use('/', homeRoute.router);
// webApp.use('/facebook', fbWebhookRoute.router);

// webApp.listen(PORT, () => {
//   console.log(`Server is up and running at ${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Verifikasi webhook (opsional, tapi disarankan)
app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = "123dibo"; // Ganti dengan token Anda

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Menerima pesan dari Facebook
app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Dapatkan ID pengirim dan teks pesan
            let sender_psid = webhook_event.sender.id;
            let received_message = webhook_event.message.text;

            // Contoh respons sederhana
            let response = {
                "text": `Halo! Anda mengirim pesan: "${received_message}".`
            };

            // Kirim respons ke Facebook (Anda perlu implementasikan ini)
            // ...
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
