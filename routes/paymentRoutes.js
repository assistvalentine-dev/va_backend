import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/razorpayService.js';
import { createStripePaymentIntent, verifyStripePayment } from '../services/stripeService.js';

const router = express.Router();

// POST /api/payments/create-order - Create payment order
router.post('/create-order', [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { userId, amount } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user already paid
    if (user.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'User has already made payment',
      });
    }

    const paymentGateway = process.env.PAYMENT_GATEWAY ;
    const fixedAmount = parseFloat(process.env.PAYMENT_AMOUNT);

    let paymentData;

    if (paymentGateway === 'razorpay') {
      // Create Razorpay order
      paymentData = await createRazorpayOrder(fixedAmount, userId);
      
      // Store Razorpay order ID
      user.razorpayOrderId = paymentData.orderId;
      await user.save();
    } else if (paymentGateway === 'stripe') {
      // Create Stripe payment intent
      paymentData = await createStripePaymentIntent(fixedAmount, userId);
      
      // Store Stripe payment intent ID
      user.stripePaymentIntentId = paymentData.paymentIntentId;
      await user.save();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment gateway configuration',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        ...paymentData,
        amount: fixedAmount,
        currency: paymentGateway === 'razorpay' ? 'INR' : 'USD',
      },
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
});

// POST /api/payments/verify - Verify payment
router.post('/verify', [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { userId, ...paymentData } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already paid
    if (user.paymentStatus === 'PAID') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: {
          userId: user._id,
          paymentStatus: user.paymentStatus,
        },
      });
    }

    const paymentGateway = process.env.PAYMENT_GATEWAY;
    let isVerified = false;
    let paymentId = null;

    if (paymentGateway === 'razorpay') {
      // Verify Razorpay payment
      const verification = await verifyRazorpayPayment(paymentData);
      isVerified = verification.isValid;
      paymentId = verification.paymentId;
    } else if (paymentGateway === 'stripe') {
      // Verify Stripe payment
      const verification = await verifyStripePayment(paymentData);
      isVerified = verification.isValid;
      paymentId = verification.paymentId;
    }

    if (isVerified) {
      // Update user payment status
      user.paymentStatus = 'PAID';
      user.paymentId = paymentId;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          userId: user._id,
          paymentStatus: user.paymentStatus,
          paymentId: user.paymentId,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
      error: error.message,
    });
  }
});

export default router;


