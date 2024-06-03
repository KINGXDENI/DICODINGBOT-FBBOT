const axios = require('axios');
require('dotenv').config();

const TOKEN = 'EAAGl7lLFiXQBO6nT6POyghfdoUc6hb5lekiyvX8tzIZBI05S25u6FjfiJ0BwPrWMWbuko9HdYF3hsnq1e4pJ7ialLcCMwOuw1hQkEZAQ8Rnxpv4zKEZAEzXLnbOrH20RAV1Dn2gzo7j6VvtKDUdXZACcVTZCD39btWUZCktfqZB6h0ZCuOjDd1WOgogzI2qzPtZAzgZAE0OkwZCNQZDZD';
const PAGE_ID = 365365943317923;

const sendMessage = async (senderId, message) => {
  let options = {
    method: 'POST',
    url: `https://graph.facebook.com/v17.0/${PAGE_ID}/messages`,
    params: {
      access_token: TOKEN
    },
    headers: { 'Content-Type': 'application/json' },
    data: {
      recipient: { id: senderId },
      messaging_type: 'RESPONSE',
      message: { text: message }
    }
  };
  let response = await axios.request(options);
  if (response['status'] == 200 && response['statusText'] === 'OK') {
    return 1;
  } else {
    return 0;
  }
};

const setTypingOn = async (senderId) => {
  let options = {
    method: 'POST',
    url: `https://graph.facebook.com/v17.0/${PAGE_ID}/messages`,
    params: {
      access_token: TOKEN
    },
    headers: { 'Content-Type': 'application/json' },
    data: {
      recipient: { id: senderId },
      sender_action: 'typing_on'
    }
  };
  let response = await axios.request(options);
  if (response['status'] == 200 && response['statusText'] === 'OK') {
    return 1;
  } else {
    return 0;
  }
};

const setTypingOff = async (senderId) => {
  let options = {
    method: 'POST',
    url: `https://graph.facebook.com/v17.0/${PAGE_ID}/messages`,
    params: {
      access_token: TOKEN
    },
    headers: { 'Content-Type': 'application/json' },
    data: {
      recipient: { id: senderId },
      sender_action: 'typing_off'
    }
  };
  let response = await axios.request(options);
  if (response['status'] == 200 && response['statusText'] === 'OK') {
    return 1;
  } else {
    return 0;
  }
};

module.exports = {
  sendMessage,
  setTypingOn,
  setTypingOff
};
