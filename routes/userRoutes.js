import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/mailService.js';

const router = express.Router();

// ================= VALIDATION RULES =================
const userValidationRules = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('age').isInt({ min: 18, max: 100 }),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('interestedIn').isIn(['Male', 'Female', 'Any']),
  body('college').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('relationshipGoal').isIn(['Casual', 'Serious', 'Marriage']),
  body('description').trim().isLength({ min: 1, max: 1000 }),
  body('preferences').trim().isLength({ min: 1, max: 1000 }),
  body('interests').isIn(['Yes', 'No']),
];

// ================= CREATE USER =================
router.post('/create', userValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name, age, gender, interestedIn, college, email,
      relationshipGoal, description, preferences, interests
    } = req.body;

    const existingUser = await User.findOne({ email });

    // -------- CASE 1: EXISTING BUT NOT VERIFIED --------
    if (existingUser && !existingUser.verifiedId) {

      // 60s cooldown before resending
      if (existingUser.lastOtpSentAt &&
          Date.now() - existingUser.lastOtpSentAt.getTime() < 60_000) {
        return res.status(429).json({
          success: false,
          message: "Please wait 60 seconds before requesting another OTP"
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      existingUser.otp = otp;
      existingUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();

      await sendVerificationEmail(existingUser.email, otp);

      return res.status(200).json({
        success: true,
        message: 'User exists but is not verified — OTP resent',
        data: {
          userId: existingUser._id,
          email: existingUser.email,
          verifiedId: false,
        },
      });
    }

    // -------- CASE 2: ALREADY PAID OR FREE --------
    if (existingUser &&
        (existingUser.paymentStatus === 'PAID' ||
         existingUser.paymentStatus === 'FREE')) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // -------- CASE 3: PENDING PAYMENT --------
    if (existingUser && existingUser.paymentStatus === 'PENDING') {
      return res.status(200).json({
        success: true,
        message: 'User exists with pending payment — proceed to payment',
        data: {
          userId: existingUser._id,
          email: existingUser.email,
          paymentStatus: existingUser.paymentStatus,
          verifiedId: existingUser.verifiedId,
        },
      });
    }

    // -------- FREE SLOT LOGIC --------
    const filledSlots = await User.countDocuments({
      gender,
      paymentStatus: { $in: ["PAID", "FREE"] }
    });

    const paymentStatus = filledSlots < 5 ? "FREE" : "PENDING";

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name, age, gender, interestedIn, college, email,
      relationshipGoal, description, preferences, interests,
      paymentStatus,
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastOtpSentAt: new Date(),
      otpAttempts: 0
    });

    await user.save();
    await sendVerificationEmail(email, otp);

    return res.status(201).json({
      success: true,
      message:
        paymentStatus === "FREE"
          ? "You are eligible for free matching 🎉"
          : "Proceed to payment",
      data: { userId: user._id, email: user.email },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ================= VERIFY OTP =================
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email })
    .select('+otp +otpExpiresAt +otpAttempts');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const currentAttempts = Number(user.otpAttempts) || 0;
  if (currentAttempts >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. Please request a new OTP.',
    });
  }

  if (user.otp === otp && user.otpExpiresAt > new Date()) {
    user.otp = null;
    user.verifiedId = true;
    user.otpAttempts = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        userId: user._id,
        email: user.email,
        paymentStatus: user.paymentStatus,
      },
    });
  }

  user.otpAttempts = currentAttempts + 1;
  await user.save();

  return res.status(400).json({
    success: false,
    message:
      user.otpExpiresAt < new Date()
        ? 'OTP expired. Please request a new one.'
        : 'Invalid OTP',
  });
});


// ================= RESEND OTP =================
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 60s cooldown
    if (user.lastOtpSentAt &&
        Date.now() - user.lastOtpSentAt.getTime() < 60_000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.lastOtpSentAt = new Date();
    user.otpAttempts = 0;
    await user.save();

    await sendVerificationEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'New OTP sent successfully',
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;

