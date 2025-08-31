const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

module.exports = paypal;
// This code configures the PayPal SDK with the client ID and secret key from environment variables.
// It sets the mode to either 'sandbox' for testing or 'live' for production,
// allowing the application to interact with PayPal's API for payment processing.
// This is typically used in a Node.js backend to handle PayPal payments.
