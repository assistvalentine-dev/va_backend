import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100'],
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },

    interestedIn: {
      type: String,
      required: [true, 'Interested in field is required'],
      enum: ['Male', 'Female', 'Any'],
    },

    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
      maxlength: [100, 'College name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,          
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    relationshipGoal: {
      type: String,
      required: [true, 'Relationship goal is required'],
      enum: ['Casual', 'Serious', 'Marriage'],
    },

    description: {
      type: String,
      required: [true, 'Self description is required'],
      trim: true
    },

    preferences: {
      type: String,
      required: [true, 'Partner preferences are required'],
      trim: true
    },

    interests: {
      type: String,
      required: [true, 'Interests are required'],
      enum: ['Yes', 'No'],
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID','FREE'],
      default: 'PENDING',
      index: true,          
    },

    paymentId: {
      type: String,
      default: null,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    // ========== OTP & Verification Fields ==========
    otp: {
      type: String,
      default: null,
      select: false,        
    },

    otpExpiresAt: {
      type: Date,
      default: null,
      select: false,        
    },

    verifiedId: {
      type: Boolean,
      default: false,
      index: true,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Indexes are declared inline on the fields (via `index: true`),
// so avoid duplicating them here to prevent Mongoose duplicate-index warnings.

const User = mongoose.model('User', userSchema);
export default User;
