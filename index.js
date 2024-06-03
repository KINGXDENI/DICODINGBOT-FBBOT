const express = require('express');r// require('dotenv').config();

const webApp = express();

const PORT = process.env.PORT || 5000;

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());
webApp.use((req, res, next) => {
  console.log(`Path ${req.path} with Method ${req.method}`);
  next();
});

const homeRoute = require('./routes/homeRoute');
const fbWebhookRoute = require('./routes/fbWebhookRoute');
const privacyRoute = require('./routes/privacyRoute');

webApp.use('/', homeRoute.router);
webApp.use('/facebook', fbWebhookRoute.router);
webApp.use('/privacy', privacyRoute.router);

webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});