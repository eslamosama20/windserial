// src/paypal/paypalConfig.js
import pkg from '@paypal/checkout-server-sdk';
const { PayPalHttpClient, SandboxEnvironment } = pkg;

const environment = new SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new PayPalHttpClient(environment);

export default client;
