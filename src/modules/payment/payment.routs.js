// src/modules/payment/payment.routes.js
import Router from 'express';
import { createOrder,orderDatais } from './payment.controller.js';

const router = Router();

router.post('/create-order', createOrder);
router.get('/orderDatails',orderDatais)

export default router;
