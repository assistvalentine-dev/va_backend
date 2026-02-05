import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

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
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('relationshipGoal')
    .isIn(['Casual', 'Serious', 'Marriage'])
    .withMessage('Relationship goal must be Casual, Serious, or Marriage'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Description must be between 50 and 1000 characters'),
  body('preferences')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Preferences must be between 50 and 1000 characters'),
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
      phone,
      email,
      relationshipGoal,
      description,
      preferences,
      interests,
    } = req.body;

    // 3️⃣ Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    // Already paid → block
    if (existingUser && existingUser.paymentStatus === 'PAID') {
      return res.status(409).json({
        success: false,
        message: 'User with this email or phone number already exists',
      });
    }

    // Pending user → allow resume payment
    if (existingUser && existingUser.paymentStatus === 'PENDING') {
      return res.status(200).json({
        success: true,
        message: 'User exists with pending payment — proceed to payment',
        data: {
          userId: existingUser._id,
          email: existingUser.email,
          formData: existingUser,
          paymentStatus: existingUser.paymentStatus,
        },
      });
    }

    // 4️⃣ Now apply your FREE offer logic
    // const paidCount = await User.countDocuments({
    //   gender: gender,
    //   paymentStatus: "PAID",
    // });

    // let paymentStatus = "PENDING";

    // // First 5 get FREE
    // if (paidCount < 5) {
    //   paymentStatus = "FREE";
    // }

    // 5️⃣ Create new user with calculated status
    const user = new User({
      name,
      age,
      gender,
      interestedIn,
      college,
      phone,
      email,
      relationshipGoal,
      description,
      preferences,
      interests,
      // paymentStatus,   // <-- dynamic (FREE or PENDING)
    });

    await user.save();

    res.status(201).json({
      success: true,
      message:
        paymentStatus === "FREE"
          ? "You are eligible for free matching 🎉"
          : "Proceed to payment",
      data: {
        userId: user._id,
        email: user.email,
        paymentStatus: user.paymentStatus,
      },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// router.get('/me', async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({ success: false, message: "Email required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200).json({ success: false, message: "New user" });
//     }

//     if (user.paymentStatus === "PAID") {
//       return res.status(409).json({
//         success: false,
//         message: "You have already completed payment",
//       });
//     }

//     // IMPORTANT PART 👇
//     return res.status(200).json({
//       success: true,
//       data: user,   // send old data back to frontend
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.put('/update/:userId', async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.userId,
//       req.body,
//       { new: true }
//     );

//     res.json({ success: true, data: user });

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Update failed" });
//   }
// });

export default router;


// NOTE: if use in situation where user exists but payment pending, handle that case separately