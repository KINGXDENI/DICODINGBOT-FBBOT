const express = require('express');
const router = express.Router();
const path = require('path');

// Privacy Policy Route
router.get('/privacy', (req, res) => {
    // Kirim file privacy policy (misalnya privacy.html)
    res.sendFile(path.join(__dirname, '../views', 'privacy.html'));
});

module.exports = {
    router,
};
