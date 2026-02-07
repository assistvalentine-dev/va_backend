import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/mailService.js';

const router = express.Router();

// Validation rules
const userValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('interestedIn')
    .isIn(['Male', 'Female', 'Any'])
    .withMessage('Interested in must be Male, Female, or Any'),
  body('college')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('College must be between 1 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('relationshipGoal')
    .isIn(['Casual', 'Serious', 'Marriage'])
    .withMessage('Relationship goal must be Casual, Serious, or Marriage'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be between 1 and 100 characters'),
  body('preferences')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Preferences must be between 1 and 100 characters'),

  body('interests')
    .isIn(['Yes', 'No'])
    .withMessage('Interests must be Yes or No'),
];

// POST /api/users/create - Create a new user
router.post('/create', userValidationRules, async (req, res) => {
  try {
    // 1️⃣ Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // 2️⃣ Destructure FIRST (important)
    const {
      name,
      age,
      gender,
      interestedIn,
      college,
      email,
      relationshipGoal,
      description,
      preferences,
      interests,
    } = req.body;

    // 3️⃣ Check existing user
    const existingUser = await User.findOne({ email });

        // if user exists but not verified, allow to resend OTP and send verification email again
    if (existingUser && existingUser.verifiedId === false) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      existingUser.otp = otp;
      existingUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
      await existingUser.save();

      const emailSent = await sendVerificationEmail(existingUser.email, otp);

      console.log(` (email sent: ${emailSent})`);

      if (!emailSent) {
        console.warn("Failed to send verification email for existing user:", existingUser.email);
      }

      return res.status(200).json({
        success: true,
        message: 'User exists but is not verified — resend OTP',
        data: {
          userId: existingUser._id,
          email: existingUser.email,
          verifiedId: existingUser.verifiedId,
        },
      });
    }


    // Already paid → block
    if (existingUser && (existingUser.paymentStatus === 'PAID' || existingUser.paymentStatus === 'FREE')) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Pending user → allow resume payment
    if (existingUser && (existingUser.paymentStatus === 'PENDING' )) {
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


    // 4️⃣ Now apply your FREE offer logic
    const filledSlots = await User.countDocuments({
      gender,
      paymentStatus: { $in: ["PAID", "FREE"] }
    });

    let paymentStatus = filledSlots < 5 ? "FREE" : "PENDING";


    // create OTP for email verification (optional, can be used later for verifying email before payment)
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes


    // 5️⃣ Create new user with calculated status
    const user = new User({
      name,
      age,
      gender,
      interestedIn,
      college,
      email,
      relationshipGoal,
      description,
      preferences,
      interests,
      paymentStatus,   // <-- dynamic (FREE or PENDING)
      otp,           // <-- store OTP for later verification
      otpExpiresAt,   // <-- store OTP expiry time
    });

    await user.save();

    // send OTP to user's email
    const emailSent = await sendVerificationEmail(email, otp);
    console.log(` (email sent: ${emailSent})`);
    if (!emailSent) {
      console.warn("Failed to send verification email for user:", email);
    }

    res.status(201).json({
      success: true,
      message:
        paymentStatus === "FREE"
          ? "You are eligible for free matching 🎉"
          : "Proceed to payment",
      data: {
        userId: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error.message,
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required',
    });
  }
  const user =  await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false, 
      message: 'User not found',
    });
  }
  if (user.otp === otp && user.otpExpiresAt > new Date()) {
    user.otp = null; // Clear OTP after successful verification
    user.verifiedId = true; // Mark user as verified
    await user.save();
    return res.status(200).json({ success: true, message: 'OTP verified successfully', data: { userId: user._id, email: user.email, paymentStatus: user.paymentStatus } });
  } else {
    return res.status(400).json({
      success: false,
      message:
        user.otpExpiresAt < new Date()
          ? "OTP expired. Please request a new one."
          : "Invalid OTP",
    });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Resend OTP request received for email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ⏳ Cooldown check (60 seconds)
    if (user.otpExpiresAt && new Date() < new Date(user.otpExpiresAt - 9 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting a new OTP',
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email
    const emailSent = await sendVerificationEmail(email, otp);

    console.log(`(email sent: ${emailSent})`);

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'New OTP sent successfully',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP email',
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;

