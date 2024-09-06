import { asyncHandler } from '../../utils/asyncHandler.js';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

// Joi validation schemas
const createOrderSchema = Joi.object({
  amount: Joi.number().positive().required(),
  userId: Joi.number().integer().required(),
});

const orderDataisSchema = Joi.object({
  orderId: Joi.string().required(),
});

// Function to get PayPal access token
const getAccessToken = async () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
};

// Create Order with Validation
export const createOrder = asyncHandler(async (req, res, next) => {
    // Validate request body with Joi
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const { amount, userId } = req.body;

        const accessToken = await getAccessToken();
        const referenceId = uuidv4();

        // Create PayPal order
        const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "reference_id": referenceId,
                        "amount": {
                            "currency_code": "USD",
                            "value": amount
                        }
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data || data.error) {
            return res.status(500).json({ success: false, message: 'Error creating PayPal order', error: data });
        }

        const newOrder = await prisma.orders.create({
            data: {
                referenceId: data.id,
                amount: parseFloat(amount),
                currency: "USD",
                status: "Pending",
                userId: userId
            }
        });

        const approvalLink = data.links.find(link => link.rel === 'approve');

        if (!approvalLink) {
            return res.status(500).json({ success: false, message: 'Approval link not found' });
        }

        res.json({ success: true, message: "Order created successfully", approvalLink: approvalLink.href });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating PayPal order', error: error.message });
    }
});

// Fetch Order Data with Validation
export const orderDatais = asyncHandler(async (req, res, next) => {
    // Validate request body with Joi
    const { error } = orderDataisSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const { orderId } = req.body;

        const accessToken = await getAccessToken();

        const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status !== 200) {
            return res.status(response.status).json({
                success: false,
                message: 'Error fetching order data',
                error: data
            });
        }

        res.json({ success: true, order: data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching order data',
            error: error.message
        });
    }
});
