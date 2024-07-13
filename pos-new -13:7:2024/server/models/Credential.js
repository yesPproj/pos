const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
    apiKey: { type: String, required: true },
    apiSecret: { type: String, required: true },
});

const Credential = mongoose.model('Credential', CredentialSchema);
module.exports = Credential;
