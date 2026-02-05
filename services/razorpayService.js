import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialization of Razorpay
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.');
    }
    
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpay;
};

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in rupees
 * @param {string} userId - User ID for reference
 * @returns {Promise<Object>} Order details
 */
export const createRazorpayOrder = async (amount, userId) => {
  try {
    const razorpayInstance = getRazorpayInstance();
    const shortReceipt = `rcpt_${crypto.randomBytes(4).toString('hex')}`;

    const options = {
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: shortReceipt,
      notes: {
        userId: userId.toString(),
      },
    };

    const order = await razorpayInstance.orders.create(options);

    return {
      orderId: order.id,
      amount: order.amount / 100, 
      currency: order.currency,
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - Payment data from frontend
 * @returns {Promise<Object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        isValid: false,
        paymentId: null,
      };
    }

    // Create signature string
    const signatureString = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signatureString)
      .digest('hex');

    // Compare signatures
    const isValid = expectedSignature === razorpay_signature;

    return {
      isValid,
      paymentId: razorpay_payment_id,
    };
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    return {
      isValid: false,
      paymentId: null,
    };
  }
};


