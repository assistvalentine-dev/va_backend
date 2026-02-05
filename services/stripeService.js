import Stripe from 'stripe';

// Lazy initialization of Stripe
let stripe = null;

const getStripeInstance = () => {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('Stripe credentials are not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
    }
    
    stripe = new Stripe(secretKey);
  }
  return stripe;
};

/**
 * Create a Stripe payment intent
 * @param {number} amount - Amount in dollars
 * @param {string} userId - User ID for reference
 * @returns {Promise<Object>} Payment intent details
 */
export const createStripePaymentIntent = async (amount, userId) => {
  try {
    const stripeInstance = getStripeInstance();
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
      },
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw new Error('Failed to create Stripe payment intent');
  }
};

/**
 * Verify Stripe payment
 * @param {Object} paymentData - Payment data from frontend
 * @returns {Promise<Object>} Verification result
 */
export const verifyStripePayment = async (paymentData) => {
  try {
    const { paymentIntentId } = paymentData;

    if (!paymentIntentId) {
      return {
        isValid: false,
        paymentId: null,
      };
    }

    // Retrieve payment intent from Stripe
    const stripeInstance = getStripeInstance();
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    // Check if payment was successful
    const isValid = paymentIntent.status === 'succeeded';

    return {
      isValid,
      paymentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment verification error:', error);
    return {
      isValid: false,
      paymentId: null,
    };
  }
};


